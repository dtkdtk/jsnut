const { readdirSync, readFileSync } = require("fs");
const { writeFile } = require("fs/promises");
const { sep, resolve: _to_absolute } = require("path");
const messages = require("./messages");

exports.sort_includes = main;



function main(code_dirs)
{
	console.log(messages.sort_includes__proccessing);

	let file_paths = get_code_files_path(code_dirs);
	file_paths.forEach(file_path => {
		const unsorted_code = readFileSync(file_path).toString();
		const sorted_code = sort_includes(unsorted_code, file_path);
		writeFile(file_path, sorted_code);
	});

	console.log(messages.sort_includes__success);
}

function get_code_files_path(code_dirs)
{
	let files = [];
	code_dirs.forEach(code_dir =>
		files = files.concat(readdirSync(_makepath(process.cwd(), code_dir), { recursive: true })
			.map(path => _makepath(_makepath(process.cwd(), code_dir), path))
			.filter(path => path.endsWith('.hh') || path.endsWith('.cc') || path.endsWith('.hpp') || path.endsWith('.cpp') || path.endsWith('.h') || path.endsWith('.c'))
		)
	);
	return files;
}

function sort_includes(file, file_path)
{
	const { sorted_includes, first_import_line, last_import_line } = extract_includes(file, file_path);
	const source_code = extract_source_code(file, first_import_line, last_import_line);
	
	const sorted_categories = Object.values(sorted_includes);
	sorted_categories.forEach(includes_array => includes_array.sort());

	let total_includes_count = 0;
	sorted_categories.forEach(includes_array => total_includes_count += includes_array.length);

	let includes = source_code[0] && total_includes_count > 0 ? '\r\n' : '';
	sorted_includes.custom_headers.length > 0 ? includes += sorted_includes.custom_headers.join('\r\n') + '\r\n\r\n' : undefined;
	sorted_includes.custom_libs.length > 0 ? includes += sorted_includes.custom_libs.join('\r\n') + '\r\n\r\n' : undefined;
	sorted_includes.extern_libs.length > 0 ? includes += sorted_includes.extern_libs.join('\r\n') + '\r\n\r\n' : undefined;
	sorted_includes.std_libs.length > 0 ? includes += sorted_includes.std_libs.join('\r\n') + '\r\n' : undefined;
	
	if (includes.endsWith('\r\n\r\n')) includes = includes.slice(0, 0 - '\r\n'.length) //fix extra empty line after includes
	if (!source_code[1].startsWith('\r\n')) source_code[1] = '\r\n' + source_code[1]; //add empty line after includes (if needed)
	if (!source_code[1].endsWith('\r\n')) source_code[1] += '\r\n'; //(bonus) add empty line to file end
	if (source_code[0].startsWith('\r\n')) source_code = source_code.slice('\r\n'.length + 1);
	return source_code[0] + includes + source_code[1];
}

function extract_includes(file, file_path)
{
	const this_file_includes = new Map();
	let line_index = 0; //one-based
	let inside_comment_block = false;
	let inside_includes_block = false;
	let comment_lines = [];
	for (const line of file.split(/\r\n|\n/))
	{
		line_index++;
		if (line.trim().startsWith("/*") && !line.includes("*/"))
		{
			inside_comment_block = true;
			comment_lines.push(line_index);
		}
		else if (line.includes("*/") && inside_comment_block)
			inside_comment_block = false;
		else if (inside_comment_block)
			continue;
		else if (line.trim().startsWith("//"))
		{
			comment_lines.push(line_index);
			continue;
		}
		else if (line.trim().startsWith("#if") || (line.trim() != '' && !inside_comment_block && !line.trim().startsWith('#')))
		{
			inside_includes_block = false;
			break;
		}
		else if (line.trim().startsWith("#include"))
		{
			this_file_includes.set(line_index, line);
			inside_includes_block = true;
		}
	}
	let sorted_includes = { custom_headers: [], custom_libs: [], extern_libs: [], std_libs: [] };
	let last_import_line = 0;
	let first_import_line = Infinity;
	this_file_includes.forEach((line, index) => {
		const header = line.split(' ')[1];
		const header_category = resolve_header_category(header);
		sorted_includes[header_category].push(line);
		
		if (index > last_import_line)
			last_import_line = index;
		if (index < first_import_line)
			first_import_line = index;
	});
	if (first_import_line == Infinity) //no includes
		first_import_line = 0;

	if (comment_lines.filter(x => x > first_import_line && x < last_import_line).length > 0)
		console.log(messages.sort_includes__comments_warning(file_path));
	
	return { sorted_includes, first_import_line, last_import_line };
}

function resolve_header_category(header)
{
	if (header.startsWith('<')) //<sth>
	{
		if (header.includes('/') || header.includes('.')) //<sth/sth> or <sth.h>
			return "extern_libs";
		else //<sth>
			return "std_libs";
	}
	else { //"sth"
		if (header.search(/^\"(\.\.\/)*lib\//) != -1) //"../lib/sth"
			return "custom_libs";
		else //"sth"
			return "custom_headers";
	}
}

function extract_source_code(file, first_import_line, last_import_line)
{
	const before_includes = file.split(/\r\n|\n/).slice(0, (first_import_line || 1) - 1).join('\r\n');
	const after_includes = file.split(/\r\n|\n/).slice(last_import_line).join('\r\n');
	return [ before_includes, after_includes ];
}



function _makepath(dirname, filename)
{
	if (filename.match(/(\/|\\)$/gi)?.length)
		filename = filename.slice(0, -1);
	const upto = filename.match(/\.\.\//g)?.length ?? 0;
	return (dirname
		.split(sep)
		.slice(0, (0 - upto) || undefined)
		.join(sep)
		+ sep
		+ filename
			.replaceAll('../', '')
			.replaceAll('./', ''))
		.replaceAll(/\\\.\\|\/\.\//gi, sep)
		.replaceAll(/\.\.$/gi, sep)
		.replaceAll(/\/|\\/gi, sep)
		.replaceAll(sep + '..' + sep, sep)
		.replaceAll(sep + '.' + sep, sep);
}