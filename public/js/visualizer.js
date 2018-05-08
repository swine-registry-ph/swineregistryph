/**

VISUALIZER.JS

A Javascript library for displaying the following data:

	1. family tree of the JSON pedigree input,
	2. covariance table of the entities in the pedigree, and
	3. inbred entities in the tree

HOW TO USE

	1. Include the visualizer.js to the index.html file
	2. Call the visualize function with a JSON parameter in the script tag

FEATURES
	1. SVG for pedigree
	2. Covariance Table
	3. Inbreeding Coefficient
	4. Toggleable Checkboxes for DOM manipulation
	5. Qualitative Data Filters
	6. Performance Table

**/

const visualize = (json) => {

		// assign the mainDiv to main_container variable for DOM manipulation
		const main_container = document.getElementById("mainDiv");
		// main_container.className = 'col s12 m12 l12 xl12';
		main_container.style.border = '1%;';
		// storage of qualitative and quantitative value keys
		let qualitative_value_keys = [];
		let quantitative_value_keys = [];

		// mapping of each qualitative keys to each possible values
		let qualitative_value_map = {};

		// storage of each entities in the pedigree (traversed from rootnode to last leaf node, top lefto to bottom right)
		let entities_tree = [];

		// stores the JSON input to treeData variable
		let treeData = json;

		// changes the string "registrationnumber" key to "name" and "parents" key to children
		treeData = JSON.parse(JSON.stringify(treeData).split('"registrationnumber":').join('"name":'));
		treeData = JSON.parse(JSON.stringify(treeData).split('"parents":').join('"children":'));

		/**	FEATURE #1. SVG for pedigree **/

		// Set initial margins for SVG dimension initialization
		let margin =	{
							top: 20,
							right: 100,
							left: 100,
							bottom: 20
						},

			width =		700,
			height =	700;

		// Set SVG size
		const svg =	d3.select("#mainDiv").append("svg")
						.attr("width", '100%')
						.attr("height", screen.height - 120),
			g	=	svg.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Set tree dimensions
		const treemap = d3.tree().size([height, width]);

		// Store the entities to nodes for tree UI creation
		const rootNode = d3.hierarchy(treeData, (d) => {return d.children;});
		const data = treemap(rootNode);
		const nodes = data.descendants();

		// Tooltip feature
		const tooltipdiv = d3.select("#mainDiv").append("div")
								.attr("class", "tooltip")
								.style("opacity", 0);

		// Add links to the nodes
		const link =	g.selectAll(".link")
						.data(nodes.slice(1))
					.enter().append("path")
						.attr("class", "link")
						.attr("d", (d) => {

							// keys in the qualitative info are pushed to qualitative_value_keys array
							// for tooltip and filter purposes
							for(let key in d.data.qualitative_info)
								if(!qualitative_value_keys.includes(key)) qualitative_value_keys.push(key);

							// keys in the quantitative info are pushed to quantitative_value_keys array
							// for tooltip and filter purposes
							for(let key in d.data.quantitative_info)
								if(!quantitative_value_keys.includes(key)) quantitative_value_keys.push(key);

							// creates map keys for each keys in the qualitative traits of entities (for filter)
							for(let i = 0; i < qualitative_value_keys.length; i++)
								qualitative_value_map[qualitative_value_keys[i]] = [];

							// generate straight line links to connect child entities to parent entities
							return "M" + d.y + "," + d.x + "H" + (d.y + (d.parent.y-d.y)/2)
							+ "V" + d.parent.x + "H" + d.parent.y;
					});

		// Add nodes as group
		const node =	g.selectAll(".node")
						.data(nodes)
					.enter().append("g")
						.attr("class", (d) => {

							return "node" + (d.children ? " node--internal" : " node--leaf");
						})
						.attr("transform", (d) => {

							return "translate(" + d.y + "," + d.x + ")";
						})

						// stores possible trait value to the array value of the keys in qualitative_value_map
						.attr("d", (d) => {

							for(let i = 0; i < qualitative_value_keys.length; i++) {

								for(let value in d.data.qualitative_info) {

									if(qualitative_value_keys[i] == value) {

										if(!qualitative_value_map[qualitative_value_keys[i]].includes(d.data.qualitative_info[value]))
											qualitative_value_map[qualitative_value_keys[i]].push(d.data.qualitative_info[value]);
									}
								}
							}

							// adds the current entity to the entities_data
							entities_tree.push(d.data);
						});

		// Add circle to node
		node.append("circle")
			.attr("r", 7)
			.style("stroke", (d) => {

				// colors the outline of the circle of the nodes depending on the sex of the entity
				for(let key in d.data.qualitative_info) {

					if(key == "sex") {
						if(d.data.qualitative_info[key] == "Male") return "#1b77b8";
						else return "#f5a905";
					}
				}
			})
			.on("mouseover", (d) => {

				// creates a table and  displays the ID of the node (for tooltip)
				let animal_info = "<h4 style='text-align:center;'> ID: " + d.data.name + "</h4><table style='border-collapse: collapse; border:1px solid black;'>";

				tooltipdiv.transition()
					.duration(200)
					.style("opacity", 0.9);

				// adds each pairs of qualitative trait and its value to the table
				for(let key in d.data.qualitative_info) {

					animal_info = animal_info + "<tr style='line-height: 0.5'><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + key + "</td><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + d.data.qualitative_info[key] + "</td></tr>";
				}

				// adds each pairs of quantitative trait and its value to the table
				for(let key in d.data.quantitative_info) {

					animal_info = animal_info + "<tr style='line-height: 0.5'><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + key + "</td><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + d.data.quantitative_info[key] + "</td></tr>";
				}

				animal_info = animal_info + "</table>"

				tooltipdiv.html(animal_info)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", (d) => {

				tooltipdiv.transition()
					.duration(500)
					.style("opacity", 0);
			});

		// Add text(id) to node
		node.append("text")
			.attr("dy", ".20em")
			.attr("x", (d) => { return d.children ? -10 : 10;})
			.style("text-anchor", function(d) { return d.children ? "end" : "start";})
			.style("font-size", "13px")
			.style("font-weight", "bold")
			.text(function(d) {return d.data.name;});


		/** FEATURE #2. Covariance Table **/

		// div for displaying covariance table

		const required_data_div = document.createElement("div");
		required_data_div.style.marginBottom = '2px';
		// required_data_div.className = "row";

		main_container.appendChild(required_data_div);

		const covariance_table_div = document.createElement("div");
		covariance_table_div.style.cssText = "border:1px solid #c6b89e; border-radius: 5px; margin-bottom: 5px; width: 100%;overflow:auto;";
		// covariance_table_div.className = "col s12 m12 l12 xl12";

		required_data_div.appendChild(covariance_table_div);

		const covariance_table_text = document.createElement("h4");
		covariance_table_text.innerHTML = "Covariance Table"
		covariance_table_text.style.cssText = "font-family: Arial, Helvetica, sans-serif; padding-left: 1%";

		covariance_table_div.appendChild(covariance_table_text);

		const covariance_table_desc = document.createElement("p");
		covariance_table_desc.innerHTML = 	"A covariance table can be used to calculate individual inbreeding values."+
											" The table contains covariance values between two individuals or the covariance"+
											" of each individual.";

		covariance_table_desc.style.cssText = "font-family: Arial, Helvetica, sans-serif; margin-left: 5%";

		covariance_table_div.appendChild(covariance_table_desc);

		const covariance_table_container = document.createElement("div");
		// covariance_table_container.className = "col s12 m12 l12 xl8";
		covariance_table_container.style.cssText = "overflow: auto;";

		covariance_table_div.appendChild(covariance_table_container);

		const covariance_table_ui = document.createElement('table');
		covariance_table_ui.cellPadding = '5';
		covariance_table_ui.style.cssText = "font-size: 12px; margin-bottom: 2%;border:1px solid black; margin-left:1%;border-collapse:collapse;";

		covariance_table_container.appendChild(covariance_table_ui);


		// function getCovarianceTableData() returns a 2D array of id names and their corresponding covariance value
		const getCovarianceTableData = () => {

			// store entities with unique names for determining covariance
			const unique_entities_array = [];

			// store unique entity names
			const unique_names_array = [];

			// push unique entities and names to unique_entities_array and unique_entity_names
			for(let i = entities_tree.length - 1; i >= 0; i--)
				if(!unique_entities_array.some(e => e.name === entities_tree[i].name)) {

				unique_entities_array.push(entities_tree[i]);
				unique_names_array.push(entities_tree[i].name);
			}


			let covariance_row = [];
			const covariance_table = [];

			// the for loop will loop unique_names_array + 1 times to allot 1 row and column for the entity names
			// at topmost row and leftmost column
			// the loop will produce an initial 2d array for the covariance table with each covariance value initialized to -1
			for(let i = 0; i < unique_names_array.length+1; i++) {
				for(let j = 0; j < unique_names_array.length+1; j++) {

						if(i == 0 && j > 0) covariance_row.push(unique_entities_array[j-1].name);
						else if(i > 0 && j == 0) covariance_row.push(unique_entities_array[i-1].name);
						else covariance_row.push(-1);
				}

				covariance_table.push(covariance_row);
				covariance_row = [];
			}

			// loop for covariance values computation
			// the inner loop will just loop up to i times to produce the lower diagonal of the table.
			// the lower diagonal values are just the same as the upper diagonal values
			for(let i = 1; i < unique_entities_array.length + 1; i++) {
				for(let j = 1; j <= i; j++) {

					// gets the entity name of the current column
					const curr_individual_name = covariance_table[i][0];

					// gets the entity object of the current column
					const curr_individual_object = unique_entities_array.filter((obj) => { return obj.name == curr_individual_name});

					// checks if entity names of the current row and column are the same
					// the covariance value in covariance_table[current_row][current_column] will be the covariance value
					// of parents of the current entity object
					if(i == j) {

						//one or two unkonwn parent
						if(curr_individual_object[0].children == undefined || curr_individual_object[0].children[0] == undefined ||
						curr_individual_object[0].children[1] == undefined) covariance_table[i][j] = 1;

						// both parents are known
						else {

							let father = curr_individual_object[0].children[0].name;
							let mother = curr_individual_object[0].children[1].name;
							let father_index, mother_index, covariance_parents;

							father_index = unique_names_array.indexOf(father);
							mother_index = unique_names_array.indexOf(mother);

							if(covariance_table[father_index+1][mother_index+1] != -1)
								covariance_parents = covariance_table[father_index+1][mother_index+1];

							else if(covariance_table[mother_index+1][father_index+1] != -1)
								covariance_parents = covariance_table[mother_index+1][father_index+1];

							covariance_table[i][j] = covariance_parents/2;
							covariance_table[i][j] = covariance_table[i][j] + 1;
						}
					}

					// different entities (row name and column name are different, 3 cases)
					// 1. both parents unknown, 2. father/mother unknown, 4. both parents known
					else {

						// case 1. assign the covariance value to 0 if both parents are unknown
						if(curr_individual_object[0].children == undefined) covariance_table[i][j] = 0;

						// case 2. get the covariance value of the current column entity and the sole parent of the current row
						else if(curr_individual_object[0].children[1] == undefined) {

							const parent_name = curr_individual_object[0].children[0].name;
							const parent_index = unique_names_array.indexOf(parent_name);

							if(covariance_table[parent_index+1][j] != -1)
								covariance_table[i][j] = covariance_table[parent_index+1][j]/2;
							else if(covariance_table[j][parent_index+1] != -1)
								covariance_table[i][j] = covariance_table[j][parent_index+1]/2;
						}

						// case 3. get the covariance value of the current column entity to both parent entities of the current row
						else if(curr_individual_object[0].children[1] != undefined &&
							curr_individual_object[0].children[0] != undefined){

							const mother_name = curr_individual_object[0].children[0].name;
							const father_name = curr_individual_object[0].children[1].name;

							const mother_index = unique_names_array.indexOf(mother_name);
							const father_index = unique_names_array.indexOf(father_name);

							let covariance = 0;

							if(covariance_table[father_index+1][j] != -1) covariance += covariance_table[father_index+1][j];
							else if(covariance_table[j][father_index+1] != -1) covariance += covariance_table[j][father_index+1];

							if(covariance_table[mother_index+1][j] != -1) covariance += covariance_table[mother_index+1][j];
							else if(covariance_table[j][mother_index+1] != -1) covariance += covariance_table[j][mother_index+1];

							covariance_table[i][j] = covariance/2;
						}
					}
				}
			}

			return covariance_table;
		}

		// assign the result of the getCovarianceTableData() to variable covariance_table for display
		const covariance_table = getCovarianceTableData();

		// create UI for covariance_table

		const covariance_table_thead = document.createElement("thead");
		const covariance_table_tbody = document.createElement("tbody");

		covariance_table_ui.appendChild(covariance_table_thead);
		covariance_table_ui.appendChild(covariance_table_tbody);

		for(let i = 0; i < covariance_table.length; i++) {

			const covariance_row = document.createElement("tr");
			// covariance_row.style.cssText = 'line-height: 0.5;';

			if(i == 0) covariance_table_thead.appendChild(covariance_row);

			for(let j = 0; j < covariance_table[i].length; j++) {

				let covariance_header = document.createElement("td");
				covariance_header.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.5;border:1px solid black;';

				if(i == 0) {

					// for each -1 value in the covariance_table, display an empty string in the table
					if(covariance_table[i][j] == -1) covariance_header.innerHTML = "";
					else covariance_header.innerHTML = covariance_table[i][j];

					covariance_row.appendChild(covariance_header);
				}

				else {

					const covariance_col = document.createElement('td');
					covariance_col.style.cssText = 'font-family: Arial, Helvetica, sans-serif;padding: 7px 7px; line-height: 0.5;border:1px solid black;';

					if(covariance_table[i][j] == -1) covariance_col.innerHTML = "";
					else covariance_col.innerHTML = covariance_table[i][j];

					covariance_row.appendChild(covariance_col);
				}
			}

			if(i!=0) covariance_table_tbody.appendChild(covariance_row);
		}

		/** FEATURE #3. Inbreeding Coefficient **/

		const show_inbreeding_div = document.createElement("div");
		show_inbreeding_div.style.cssText = "border:1px solid #c6b89e;border-radius:5px; margin-bottom: 5px;width:100%;overflow:auto;";

		required_data_div.appendChild(show_inbreeding_div);

		const show_inbreeding_text = document.createElement("h4");
		show_inbreeding_text.innerHTML = "Inbreeding Table"
		show_inbreeding_text.style.cssText = "font-family:Arial, Helvetica, sans-serif;padding-left:1%";

		const inbreeding_table_desc = document.createElement("p");
		inbreeding_table_desc.innerHTML =	"Inbreeding results from the mating of two organisms that are closely-related genetically."+
											" Their offsprings are considered inbred organisms.";
		inbreeding_table_desc.style.cssText = "font-family:Arial, Helvetica, sans-serif;margin-left:5%";

		const show_inbreeding_table_container = document.createElement("div");

		show_inbreeding_div.appendChild(show_inbreeding_text);
		show_inbreeding_div.appendChild(inbreeding_table_desc);
		show_inbreeding_div.appendChild(show_inbreeding_table_container);

		const inbreeding_table = document.createElement('table');
		inbreeding_table.cellPadding = '5';
		inbreeding_table.style.cssText = "font-size:12px; margin-bottom:1%;border:1px solid black;border-collapse:collapse;margin-left:1%;";

		show_inbreeding_table_container.appendChild(inbreeding_table);

		const inbreeding_table_header = document.createElement("tr");

		inbreeding_table.appendChild(inbreeding_table_header);

		const inbred_header = document.createElement("td");
		inbred_header.innerHTML = 'Inbred Entity';
		inbred_header.style.cssText = 'font-family: Arial, Helvetica, sans-serif; border:1px solid black;';

		const inbreeding_coefficient = document.createElement("td");
		inbreeding_coefficient.innerHTML = 'Inbreeding Coefficient';
		inbreeding_coefficient.style.cssText = 'font-family: Arial, Helvetica, sans-serif; border:1px solid black;';

		inbreeding_table_header.appendChild(inbred_header);
		inbreeding_table_header.appendChild(inbreeding_coefficient);

		// return a 2D array of entity names and their inbreeding coefficient
		// gets the value in covariance_table[index][index] then subtracts 1. an entity is inbred if the difference > 0
		const getInbreedingTableData = () => {

			const inbred_entities = [];
			let inbreed_rows = [];

			for(let i = 1; i < covariance_table.length; i++) {
				for(let j = 1; j < covariance_table[i].length; j++) {

					if(i == j) {

						if(covariance_table[i][j] - 1 >  0) {

							let entity_name = covariance_table[0][j];
							let coeff = covariance_table[i][j] - 1;

							inbreed_rows.push(entity_name);

							inbreed_rows.push((covariance_table[i][j] - 1).toFixed(4));

							inbred_entities.push(inbreed_rows);
						}
					}

					inbreed_rows = [];
				}
			}

			return inbred_entities;
		}

		// assign result of getInbreedingTableData() to variable inbred_entities
		const inbred_entities = getInbreedingTableData();

		for(let i = 0; i < inbred_entities.length; i++) {

			const inbred_row = document.createElement("tr");
			inbred_row.style.cssText = 'line-height: 0.5;';

			let entity_name_cell = document.createElement("td");
			entity_name_cell.innerHTML = inbred_entities[i][0];
			entity_name_cell.style.cssText = 'font-family: Arial, Helvetica, sans-serif;padding: 7px 7px; line-height: 1;border:1px solid black;';

			let coeff_cell = document.createElement("td");
			coeff_cell.innerHTML = inbred_entities[i][1];
			coeff_cell.style.cssText = 'font-family: Arial, Helvetica, sans-serif;padding: 7px 7px; line-height: 1;border:1px solid black;';

			inbred_row.appendChild(entity_name_cell);
			inbred_row.appendChild(coeff_cell);

			inbreeding_table.appendChild(inbred_row);
		}

		/** FEATURE #4 Toggleable Checkboxes **/

		const checkbox_div = document.createElement("div");
		// checkbox_div.className = "col s4 m4 l4 xl12";
		checkbox_div.style.cssText = "border:1px solid #c6b89e;border-radius:5px;margin-bottom:5px; padding-left: 10px;";

		const checkbox_form = document.createElement("form");
		checkbox_form.action = "#";

		// when filter_input is checked, the filter_div will appear, unchecking will make the filter_div disappear

		const filter_p = document.createElement("p");

		const filter_input = document.createElement("input");
		filter_input.type = 'checkbox';
		// filter_input.className = "filled-in";
		filter_input.id = "filterCheckBox";

		const filter_label = document.createElement("label");
		filter_label.innerHTML = "Show filters";
		filter_label.setAttribute("for", filter_input.id);
		filter_label.style.cssText = 'font-family: Arial, Helvetica, sans-serif;';

		// when filter_input is checked, the performance_div will appear, unchecking will make the performance_div disappear

		const performance_p = document.createElement("p");

		const performance_input = document.createElement("input");
		performance_input.type = 'checkbox';
		// performance_input.className = "filled-in";
		performance_input.id = "performanceCheckBox";

		const performance_label = document.createElement("label");
		performance_label.innerHTML = "Show Performance Table";
		performance_label.setAttribute("for", performance_input.id);
		performance_label.style.cssText = 'font-family: Arial, Helvetica, sans-serif;';

		// when inbreeding_input is checked, the inbred entities in the SVG pedigree will be filled with red, unchecking will unfill
		const inbreeding_p = document.createElement("p");

		const inbreeding_input = document.createElement("input");
		inbreeding_input.type = 'checkbox';
		// inbreeding_input.className = "filled-in";
		inbreeding_input.id = "inbreedingCheckBox";

		const inbreeding_label = document.createElement("label");
		inbreeding_label.innerHTML = "Show Inbred Entities";
		inbreeding_label.setAttribute("for", inbreeding_input.id);
		inbreeding_label.style.cssText = 'font-family: Arial, Helvetica, sans-serif;';

		const inbred_legend = document.createElement("p");
		inbred_legend.innerHTML = '* The inbred entities will appear RED in the pedigree.';
		inbred_legend.style.cssText = "font-family:Arial, Helvetica, sans-serif;font-size:10px;color:red;display:none";

		checkbox_form.appendChild(filter_p);
		filter_p.appendChild(filter_input);
		filter_p.appendChild(filter_label);
		checkbox_form.appendChild(performance_p);
		performance_p.appendChild(performance_input);
		performance_p.appendChild(performance_label);
		checkbox_form.appendChild(inbreeding_p);
		inbreeding_p.appendChild(inbreeding_input);
		inbreeding_p.appendChild(inbreeding_label);
		checkbox_form.appendChild(inbred_legend);

		checkbox_div.appendChild(checkbox_form);

		main_container.appendChild(checkbox_div);

		/** FEATURE #5 Qualitative Data Filters **/

		const filter_div = document.createElement('div');
		filter_div.style.cssText = 	"border:1px solid #c6b89e;border-radius:5px;display:none;margin-bottom:5px;width:100%;overflow:auto;height:250px;";
		// filter_div.className = 'col s12 m12 l12 xl12';

		main_container.appendChild(filter_div);

		const filter_text = document.createElement("h4");
		filter_text.innerHTML = "Qualitative Data Filter";
		filter_text.style.cssText = "font-family:Arial, Helvetica, sans-serif;padding-left:1%;";

		filter_div.appendChild(filter_text);

		const filter_buttons_div = document.createElement('div');
		// filter_buttons_div.className = 'col s12 m12 l12 xl12';
		filter_buttons_div.cssText = 'width:100%;';

		// flag is used to monitor if there is already at least 1 filter (for displaying "Go Filter" button)
		let flag = false;

		const add_button = document.createElement('button');
		add_button.appendChild(document.createTextNode("Add Filters"));
		add_button.type = "submit";
		add_button.style.cssText =	"color:white;margin-left:1%;margin-bottom:1%;background:steelblue;font-family:Arial, Helvetica, sans-serif;padding:0.5%;";
		// add_button.className = 'btn-flat btn-small light-blue darken-4';

		const filter_button = document.createElement('button');
		filter_button.appendChild(document.createTextNode("Go Filter!"));
		filter_button.type = 'submit';
		filter_button.style.cssText = "color:white;margin-right:1%;margin-bottom:1%;float:right;padding:0.5%;background:green;font-family:Arial, Helvetica, sans-serif;";
		// filter_button.className = 'btn-flat btn-small green accent-4';

		filter_buttons_div.appendChild(add_button);
		filter_div.appendChild(filter_buttons_div);

		const input_div_container = document.createElement("div");
		input_div_container.style.cssText = "overflowY:auto; max-height:200px;";

		filter_div.appendChild(input_div_container);

		add_button.addEventListener('click', function() {

			flag = true;

			const filter_input_div = document.createElement('div');
			// filter_input_div.className = 'col s12 m12 l12 xl12 input-field';
			filter_input_div.style.cssText = 'width:100%;';

			input_div_container.appendChild(filter_input_div);

			const dropdown_key = document.createElement("div");
			dropdown_key.className = "dropdown";
			dropdown_key.style.cssText = 'width: 45%; margin-left:1%;';

			const dropdown_key_select = document.createElement("div");
			dropdown_key_select.className = "select";

			const span_key = document.createElement("span");
			span_key.innerHTML = "Select Filter";

			dropdown_key.appendChild(dropdown_key_select);
			dropdown_key_select.appendChild(span_key);

			key_input = document.createElement("input");
			key_input.type = 'hidden';
			key_input.name = 'key';
			// key_input.value = qualitative_value_keys[0];

			dropdown_key.appendChild(key_input);

			key_ul = document.createElement('ul');
			key_ul.className = 'dropdown-menu';
			key_ul.style.cssText = 'display:none;';

			dropdown_key.appendChild(key_ul);

			for(let i = 0; i < qualitative_value_keys.length; i++) {

				const key_li = document.createElement('li');
				key_li.id = qualitative_value_keys[i];
				key_li.innerHTML = qualitative_value_keys[i];
				key_ul.appendChild(key_li);
			}

			dropdown_key.addEventListener('click', function () {

				if(this.childNodes[2].style.display == 'none') this.childNodes[2].style.display = 'block';
				else this.childNodes[2].style.display = 'none';
			});

			filter_input_div.appendChild(dropdown_key);

			const dropdown_value = document.createElement("div");
			dropdown_value.className = "dropdown";
			dropdown_value.style.cssText = 'width: 45%; margin-left:1%;';

			const dropdown_value_select = document.createElement("div");
			dropdown_value_select.className = "select";

			const span_value = document.createElement("span");
			span_value.innerHTML = "Select Value";

			dropdown_value.appendChild(dropdown_value_select);
			dropdown_value_select.appendChild(span_value);

			value_input = document.createElement("input");
			value_input.type = 'hidden';
			value_input.name = 'value';
			// value_input.value = qualitative_value_map[key_input.value][0];

			dropdown_value.appendChild(value_input);

			value_ul = document.createElement('ul');
			value_ul.className = 'dropdown-menu';
			value_ul.style.cssText = 'display:none';

			dropdown_value.appendChild(value_ul);

			dropdown_value.addEventListener('click', function () {

				let input_value = this.parentNode.childNodes[0].childNodes[1].value;
				let values_length = this.childNodes[2].childNodes.length;

				for(let j = values_length - 1; j >= 0; j--) this.childNodes[2].removeChild(this.childNodes[2].childNodes[j]);

				for(let k = 0; k < qualitative_value_map[input_value].length; k++) {

					opt = document.createElement('li');
					opt.id = qualitative_value_map[input_value][k];
					opt.innerHTML = qualitative_value_map[input_value][k];
					this.childNodes[2].appendChild(opt);

					opt.addEventListener('click', function() {

						console.log('pasok');

						this.parentNode.parentNode.childNodes[0].childNodes[0].innerHTML = this.innerHTML;
						this.parentNode.parentNode.childNodes[1].value = this.id;
					});

				}

				if(this.childNodes[2].style.display == 'none') this.childNodes[2].style.display = 'block';
				else this.childNodes[2].style.display = 'none';

			});

			filter_input_div.appendChild(dropdown_value);

			let key_list = key_ul.childNodes;

			for(let i = 0; i < key_list.length; i++) {

				key_list[i].addEventListener('click', function() {

		  			// console.log(this.parentNode.parentNode);
		    		this.parentNode.parentNode.childNodes[0].childNodes[0].innerHTML = this.innerHTML;
		      		this.parentNode.parentNode.childNodes[1].value = this.id;

			      	const values_length = this.parentNode.parentNode.parentNode.childNodes[1].childNodes[2].length;
			      	span_value.innerHTML = qualitative_value_map[this.id][0];
			      	this.parentNode.parentNode.parentNode.childNodes[1].childNodes[1].value = qualitative_value_map[this.id][0];

			      	// console.log(value_ul.childNodes);

			      	if(this.parentNode.parentNode.parentNode.childNodes[1].childNodes[2].style.display == 'block') {

						// console.log(this.parentNode.parentNode.parentNode.childNodes[1].childNodes[2]);
						this.parentNode.parentNode.parentNode.childNodes[1].childNodes[2].style.display = 'none';
					}

					for(let j = values_length - 1; j >= 0; j--) this.parentNode.parentNode.parentNode.childNodes[1].childNodes[2].removeChild(this.parentNode.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[j]);

					for(let k = 0; k < qualitative_value_map[this.id].length; k++) {

						opt = document.createElement('li');
						opt.id = qualitative_value_map[this.id][k];
						opt.innerHTML = qualitative_value_map[this.id][k];
						value_ul.appendChild(opt);
					}
		    	});
			}

			// const select_key_div = document.createElement('div');
			// // select_key_div.className = 'col s5 m5 l5 xl5';
			// select_key_div.style.cssText = 'width: 45%; margin-left:1%;';

			// const select_key = document.createElement('select');
			// // select_key.className = 'browser-default';
			// select_key.style.cssText = 'height: 3%; width: 100%; float:left;';

			// select_key_div.append(select_key);

			// const select_value_div = document.createElement('div');
			// // select_value_div.className = 'col s5 m5 l5 xl5';
			// select_value_div.style.cssText = 'width: 45%; margin-left:1%;float:left;';

			// const select_value = document.createElement('select');
			// // select_value.className = 'browser-default';
			// select_value.style.cssText = 'height: 3%; width: 100%;float:left;';

			// select_value_div.appendChild(select_value);

			// for(let i = 0; i < qualitative_value_keys.length; i++) {

			// 	const key_option = document.createElement('option');
			// 	key_option.value = qualitative_value_keys[i];
			// 	key_option.innerHTML = qualitative_value_keys[i];
			// 	select_key.appendChild(key_option);
			// }

			// for(let i = 0; i < qualitative_value_map[select_key.value].length; i++) {

			// 	const value_option = document.createElement('option');
			// 	value_option.value = qualitative_value_map[select_key.value][i];
			// 	value_option.innerHTML = qualitative_value_map[select_key.value][i];
			// 	select_value.appendChild(value_option);
			// }

			// select_key.addEventListener('change', function() {

			// 	const selectLength = select_value.options.length;

			// 	for(let i = select_value.options.length - 1; i >= 0; i--) select_value.remove(i);

			// 	for(let i = 0; i < qualitative_value_map[select_key.value].length; i++) {

			// 		opt = document.createElement('option');
			// 		opt.value = qualitative_value_map[select_key.value][i];
			// 		opt.innerHTML = qualitative_value_map[select_key.value][i];
			// 		select_value.appendChild(opt);
			// 	}
			// });

			let delete_button = document.createElement('button');
			delete_button.appendChild(document.createTextNode('x'));
			delete_button.style.cssText =	"color:white; margin-right:1%; background: red;margin-left:1%; height: 2%; margin-bottom:1%; width: 2%; height: 2%;";
			// delete_button.className = 'btn-flat btn-small red darken-4';
			delete_button.addEventListener('click', function() {

				if(this.parentNode.parentNode.childNodes.length == 1) {

					filter_buttons_div.removeChild(filter_buttons_div.childNodes[1]);
					flag = false;
				}
				this.parentNode.parentNode.removeChild(this.parentNode);
			});

			// filter_input_div.appendChild(select_key_div);
			// filter_input_div.appendChild(select_value_div);
			filter_input_div.appendChild(delete_button);

			// check if there is at least one filter
			if(flag) filter_buttons_div.appendChild(filter_button);
		});

		filter_button.addEventListener('click', function() {

			// resets the tree to default (all nodes with white fill)
			if(inbreeding_input.checked == true) {

				inbreeding_input.checked = false;
				inbred_legend.style.display = 'none';
			}

			node.append("circle")
			.attr("r", 7)
			.style("stroke", function(d) {

				for(let key in d.data.qualitative_info) {

					if(key == "sex") {
						if(d.data.qualitative_info[key] == "Male") return "#1b77b8";
						else return "#f5a905";
					}
				}
			})
			.style("fill", function(d) {

				return "white";
			});

			let i = 0;

			let keysForFilter = [], valuesForFilter = [];	// will be used for traversing the tree

			while(i < input_div_container.childNodes.length) {

				keysForFilter.push(input_div_container.childNodes[i].childNodes[0].childNodes[1].value);
				valuesForFilter.push(input_div_container.childNodes[i].childNodes[1].childNodes[1].value);

				i++;
			}

			console.log(keysForFilter);
			console.log(valuesForFilter);

			// fill nodes according to filter
			node.append("circle")
			.attr("r", 7)
			.style("stroke", function(d) {

				for(let key in d.data.qualitative_info) {

					if(key == "sex") {
						if(d.data.qualitative_info[key] == "Male") return "#1b77b8";
						else return "#f5a905";
					}
				}
			})
			.style("fill", function(d) {

				for(let i = 0; i < keysForFilter.length; i++) {

					for(let key in d.data.qualitative_info) {

						if(key == keysForFilter[i]) {

							if(d.data.qualitative_info[key].toLowerCase() == valuesForFilter[i].toLowerCase()) {

								if(d.data.qualitative_info.sex == "Male") return "#1b77b8";
								else if(d.data.qualitative_info.sex == "Female") return "#f5a905";
							}
						}
					}
				}
			})
			.on("mouseover", function(d) {

				// creates a table and  displays the ID of the node (for tooltip)
				let animal_info = "<h4 style='text-align:center;'> ID: " + d.data.name + "</h4><table style='border-collapse:collapse;'>";

				tooltipdiv.transition()
					.duration(200)
					.style("opacity", 0.9);

				for(let key in d.data.qualitative_info) {

					animal_info = animal_info + "<tr style='line-height: 0.5'><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + key + "</td><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + d.data.qualitative_info[key] + "</td></tr>";
				}

				// adds each pairs of quantitative trait and its value to the table
				for(let key in d.data.quantitative_info) {

					animal_info = animal_info + "<tr style='line-height: 0.5'><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + key + "</td><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + d.data.quantitative_info[key] + "</td></tr>";
				}

				animal_info = animal_info + "</table>"

				tooltipdiv.html(animal_info)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY - 28) + "px");
			})
			.on("mouseout", function(d) {

				tooltipdiv.transition()
					.duration(500)
					.style("opacity", 0);
			});

		});

		/** FEATURE #6 Performance Table **/

		const getQualitativeDataCount = () => {	// return JSON of the qualitative data of the pedigree

			let qualitative_data_object = {};
			let count = 0;

			for(let i = 0; i < qualitative_value_keys.length; i++) {

				qualitative_data_object[qualitative_value_keys[i]] = [];

				for(let j = 0; j < qualitative_value_map[qualitative_value_keys[i]].length; j++) {

					let trait_count_pair = {};

					for(let x = 0; x < entities_tree.length; x++) {

						if(entities_tree[x].qualitative_info[qualitative_value_keys[i]] == qualitative_value_map[qualitative_value_keys[i]][j]) count++;
					}

					trait_count_pair[qualitative_value_map[qualitative_value_keys[i]][j]] = count;
					qualitative_data_object[qualitative_value_keys[i]].push(trait_count_pair);
					count = 0;
				}
			}

			return qualitative_data_object;
		}

		let qualitative_data_object = getQualitativeDataCount();

		// let performance_div = document.createElement("div");
		// performance_div.style.display = 'none';
		// performance_div.className = 'col s12 m12 l12 xl12';

		// main_container.appendChild(performance_div);

		let qualitative_data_container = document.createElement("div");
		qualitative_data_container.style.cssText = "border:1px solid #c6b89e;border-radius:5px;margin-bottom:5px;display:none;width:100%;overflow:auto;";
		// qualitative_data_container.className = 'col s12 m12 l12 xl12';

		let qualitative_text = document.createElement("h4");
		qualitative_text.innerHTML = "Qualitative Data"
		qualitative_text.style.fontFamily = 'Arial, Helvetica, sans-serif';
		qualitative_text.style.paddingLeft = '1%';

		qualitative_data_container.appendChild(qualitative_text);

		main_container.appendChild(qualitative_data_container);

		//	tables for qualitative data

		for(let i = 0; i < Object.keys(qualitative_data_object).length; i++) {

			let curr_trait = Object.keys(qualitative_data_object)[i];

			let trait_text = document.createElement("h5");
			trait_text.innerHTML = curr_trait
			trait_text.style.fontFamily = 'Arial, Helvetica, sans-serif';
			trait_text.style.paddingLeft = '1%';
			trait_text.className = 'left-align';

			qualitative_data_container.appendChild(trait_text);

			let trait_table = document.createElement("table");
			trait_table.cellPadding = '5';
			trait_table.style.cssText = 'font-size:12px;margin-bottom:1%;border-collapse:collapse;margin-left:1%;';

			let trait_row = document.createElement("tr");
			trait_row.style.cssText = 'line-height: 0.8;';

			trait_table.appendChild(trait_row);

			let traitword_text = document.createElement("th");
			traitword_text.innerHTML = 'Data';
			traitword_text.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

			trait_row.appendChild(traitword_text);

			for(let j = 0; j < qualitative_data_object[curr_trait].length; j++) {

				let trait_value = document.createElement("td");
				trait_value.innerHTML = Object.keys(qualitative_data_object[curr_trait][j])[0];
				trait_value.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

				trait_row.appendChild(trait_value);
			}

			let count_row = document.createElement("tr");

			trait_table.appendChild(count_row);

			let count_text = document.createElement("th");
			count_text.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';
			count_text.innerHTML = 'Count';
			count_text.style.fontFamily = 'Arial, Helvetica, sans-serif';

			count_row.appendChild(count_text);

			let count = 0;

			for(let j = 0; j < qualitative_data_object[curr_trait].length; j++) {

				let trait_count = document.createElement("td");
				trait_count.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';
				trait_count.innerHTML = qualitative_data_object[curr_trait][j][Object.keys(qualitative_data_object[curr_trait][j])[0]];
				trait_count.style.fontFamily = 'Arial. Helvetica, sans-serif';

				count_row.appendChild(trait_count);
			}

			qualitative_data_container.appendChild(trait_table);
		}

		const getQuantitativeDataCount = () => {	// returns array of quantitative data

			let quantitative_data_array = [];
			let mean = 0, max = 0, min = 9999, std = 0, total = 0;
			let count = entities_tree.length;

			for(let i = 0; i < quantitative_value_keys.length; i++) {

				let quantitative_data_object = {};

				quantitative_data_object['data'] = quantitative_value_keys[i];

				for(let j = 0; j < entities_tree.length; j++) {

					total += entities_tree[j].quantitative_info[quantitative_value_keys[i]];

					if(entities_tree[j].quantitative_info[quantitative_value_keys[i]] > max) max = entities_tree[j].quantitative_info[quantitative_value_keys[i]];
					if(entities_tree[j].quantitative_info[quantitative_value_keys[i]] < min) min = entities_tree[j].quantitative_info[quantitative_value_keys[i]];
				}

				quantitative_data_object['minimum'] = min;
				quantitative_data_object['maximum'] = max;

				mean = total/count;

				quantitative_data_object['ave'] = mean;

				for(let j = 0; j < entities_tree.length; j++) {

					std += Math.pow((entities_tree[j].quantitative_info[quantitative_value_keys[i]] - mean), 2);
				}

				std = Math.sqrt(std/(count-1));

				quantitative_data_object['stdev'] = std;

				min = 9999; max = 0; mean = 0; std = 0; total = 0;

				quantitative_data_array.push(quantitative_data_object);
			}

			return quantitative_data_array;
		}

		const quantitative_data_array = getQuantitativeDataCount();

		let quantitative_data_container = document.createElement("div");
		quantitative_data_container.style.cssText = "border:1px solid #c6b89e;border-radius:5px;margin-bottom:5px; display:none;width:100%;overflow:auto;";
		// quantitative_data_container.className = 'col s12 m12 l12 xl12'

		main_container.appendChild(quantitative_data_container);

		let quantitative_text = document.createElement("h4");
		quantitative_text.innerHTML = "Quantitative Data";
		quantitative_text.style.cssText = "font-family: Arial, Helvetica, sans-serif; padding-left: 1%;"

		quantitative_data_container.appendChild(quantitative_text);

		let quanti_table = document.createElement("table");
		quanti_table.style.cssText = 'font-size:12px;margin-bottom:2%;border-collapse:collapse;margin-left:1%;';
		// quanti_table.className = 'responsive-table striped';

		let quanti_head = document.createElement("thead");

		let headings_row = document.createElement("tr");
		headings_row.style.cssText = 'line-height: 0.8;';

		quanti_table.appendChild(quanti_head);

		let trait_col = document.createElement("th");
		trait_col.innerHTML = 'Data';
		trait_col.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

		let min_col = document.createElement("td");
		min_col.innerHTML = 'Minimum';
		min_col.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

		let max_col = document.createElement("td");
		max_col.innerHTML = 'Maximum';
		max_col.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

		let ave_col = document.createElement("td");
		ave_col.innerHTML = 'Average';
		ave_col.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

		let std_col = document.createElement("td");
		std_col.innerHTML = 'Standard Deviation';
		std_col.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

		quanti_head.appendChild(headings_row);

		headings_row.appendChild(trait_col);
		headings_row.appendChild(min_col);
		headings_row.appendChild(max_col);
		headings_row.appendChild(ave_col);
		headings_row.appendChild(std_col);

		let mean = 0, max = 0, min = 9999, std = 0, total = 0;
		let count = entities_tree.length;

		for(let i = 0; i < quantitative_data_array.length; i++) {

			let quanti_row = document.createElement("tr");
			quanti_row.style.cssText = 'line-height: 0.8;';

			let quanti_trait = document.createElement("th");
			quanti_trait.innerHTML = quantitative_data_array[i]['data'];
			quanti_trait.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

			quanti_row.appendChild(quanti_trait);

			let min_cell = document.createElement("td");
			min_cell.innerHTML = quantitative_data_array[i]['minimum'];
			min_cell.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

			let max_cell = document.createElement("td");
			max_cell.innerHTML = quantitative_data_array[i]['maximum'];
			max_cell.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

			let mean_cell = document.createElement("td");
			mean_cell.innerHTML = quantitative_data_array[i]['ave'].toFixed(4);
			mean_cell.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

			let std_cell = document.createElement("td");
			std_cell.innerHTML = quantitative_data_array[i]['stdev'].toFixed(4);
			std_cell.style.cssText = 'font-family: Arial, Helvetica, sans-serif; padding: 7px 7px; line-height: 0.8;border:1px solid black;';

			quanti_row.appendChild(min_cell);
			quanti_row.appendChild(max_cell);
			quanti_row.appendChild(mean_cell);
			quanti_row.appendChild(std_cell);

			quanti_table.appendChild(quanti_row);
		}

		quantitative_data_container.appendChild(quanti_table);

		filter_input.addEventListener('change', function() {

			if(filter_input.checked == true) filter_div.style.display = 'block';
			else filter_div.style.display = 'none';
		});

		performance_input.addEventListener('change', function() {

			if(performance_input.checked == true) {

				qualitative_data_container.style.display = 'block';
				quantitative_data_container.style.display = 'block';
			}

			else {

				qualitative_data_container.style.display = 'none';
				quantitative_data_container.style.display = 'none';
			}
		});

		inbreeding_input.addEventListener('change', function() {

			if(inbreeding_input.checked == true) {

				inbred_legend.style.display = 'block';

				node.append("circle")
				.attr("r", 7)
				.style("stroke", function(d) {

					for(let key in d.data.qualitative_info) {

						if(key == "sex") {
							if(d.data.qualitative_info[key] == "Male") return "#1b77b8";
							else return "#f5a905";
						}
					}
				})
				.style("fill", function(d) {

					for(let i = 0; i < inbred_entities.length; i++) {

						if(d.data.name == inbred_entities[i][0]) return 'red';
					}
				})
				.on("mouseover", function(d) {

					// creates a table and  displays the ID of the node (for tooltip)
					let animal_info = "<h4 style='text-align:center;'> ID: " + d.data.name + "</h4><table style='border-collapse:collapse;'>";

					tooltipdiv.transition()
						.duration(200)
						.style("opacity", 0.9);

					for(let key in d.data.qualitative_info) {

						animal_info = animal_info + "<tr style='line-height: 0.5'><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + key + "</td><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + d.data.qualitative_info[key] + "</td></tr>";
					}

					// adds each pairs of quantitative trait and its value to the table
					for(let key in d.data.quantitative_info) {

						animal_info = animal_info + "<tr style='line-height: 0.5'><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + key + "</td><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + d.data.quantitative_info[key] + "</td></tr>";
					}

					animal_info = animal_info + "</table>"

					tooltipdiv.html(animal_info)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				})
				.on("mouseout", function(d) {

					tooltipdiv.transition()
						.duration(500)
						.style("opacity", 0);
				});

			}

			else {

				inbred_legend.style.display = 'none';

				node.append("circle")
				.attr("r", 7)
				.style("stroke", function(d) {

					for(let key in d.data.qualitative_info) {

						if(key == "sex") {
							if(d.data.qualitative_info[key] == "Male") return "#1b77b8";
							else return "#f5a905";
						}
					}
				})
				.style("fill", function(d) {

					return "white";
				})
				.on("mouseover", function(d) {

					// creates a table and  displays the ID of the node (for tooltip)
					let animal_info = "<h4 style='text-align:center;'> ID: " + d.data.name + "</h4><table style='border-collapse:collapse;'>";

					tooltipdiv.transition()
						.duration(200)
						.style("opacity", 0.9);

					for(let key in d.data.qualitative_info) {

						animal_info = animal_info + "<tr style='line-height: 0.5'><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + key + "</td><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + d.data.qualitative_info[key] + "</td></tr>";
					}

					// adds each pairs of quantitative trait and its value to the table
					for(let key in d.data.quantitative_info) {

						animal_info = animal_info + "<tr style='line-height: 0.5'><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + key + "</td><td style='padding: 7px 7px; line-height: 0.5;border:1px solid black;'>" + d.data.quantitative_info[key] + "</td></tr>";
					}

					animal_info = animal_info + "</table>"

					tooltipdiv.html(animal_info)
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
				})
				.on("mouseout", function(d) {

					tooltipdiv.transition()
						.duration(500)
						.style("opacity", 0);
				});
			}
		});
	}
