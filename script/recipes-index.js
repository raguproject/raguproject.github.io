
$.ajaxSetup({
    async: false
});

//---------- GET ALPHABET JSON ---------
var alphabet_json;
$.getJSON("https://raw.githubusercontent.com/giuliamanganelli/ragu/main/json/alphabet.json", function (json) {
    alphabet_json = json;
});

//---------- CREATE ALPHABETICAL INDEX ---------
$(document).ready(function () {
    for (const i in alphabet_json) {
        const links = alphabet_json[i];
        const div = document.getElementById('letter_space');
        const ol = document.createElement('ol');
        ol.classList = "index_letters";
        ol.classList.add("col-6");
        ol.appendChild(document.createTextNode(i));
        var val_ord = Object.values(links).sort();
        var keys_ord = Object.keys(links).sort();
        for (const link in val_ord) {
            const ids = val_ord[link];
            const a = document.createElement('a');
            a.appendChild(document.createTextNode(ids));
            a.id = keys_ord[link];
            a.name = "recipe_a";
            a.classList = "recipe_a";
            a.href = "#myModal";
            a.dataset.toggle = "modal";
            a.dataset.target = "modal";
            ol.appendChild(a);
        }
        div.appendChild(ol);
    }
});

//---------- GET PLACES JSON ---------
var provenance_json;
$.getJSON("https://raw.githubusercontent.com/giuliamanganelli/ragu/main/json/provenance.json", function (json) {
    provenance_json = json;
});

//---------- POPULATE PROVENANCE CHECKBOX ---------
$(document).ready(function () {
    var cities = (Object.keys(provenance_json).sort());
    for (var i = 0; i < cities.length; i++) {
        var prov_nospace = cities[i].split(' ').join('_');
        var li = document.createElement('li');
        var checkbox = document.createElement('input');
        var label = document.createElement('label');
        li.classList = "checkbox-li";
        checkbox.type = "checkbox";
        checkbox.classList = "recipe";
        checkbox.name = "place";
        checkbox.value = prov_nospace.toLowerCase();
        checkbox.id = prov_nospace.toLowerCase();
        var label = document.createElement('label')
        label.htmlFor = prov_nospace.toLowerCase();
        label.classList = "form-x";
        label.appendChild(document.createTextNode(cities[i]));
        var provenance = document.getElementById('provenance');
        provenance.appendChild(li);
        li.appendChild(checkbox);
        li.appendChild(label);
    }

    for (const city in provenance_json) {
        const recipe_city = provenance_json[city];
        for (const x of recipe_city) {
            const recipes_nodes = document.getElementsByName("recipe_a");
            for (node of recipes_nodes) {
                const node_id = node.id;
                if (node_id == x) {
                    node.dataset.place = city.toLowerCase().split(' ').join('_');
                }
            }
        }
    }
});

//---------- GET INGREDIENTS JSON ---------
var ingredients_json;
$.getJSON("https://raw.githubusercontent.com/giuliamanganelli/ragu/main/json/ingredients.json", function (json) {
    ingredients_json = json;
});

//---------- POPULATE INGREDIENTS CHECKBOX ---------
$(document).ready(function () {
    var ingredients = (Object.keys(ingredients_json).sort());
    for (var i = 0; i < ingredients.length; i++) {
        var ingr_nospace = ingredients[i].split(' ').join('_');
        var li = document.createElement('li');
        var checkbox = document.createElement('input');
        var label = document.createElement('label');
        li.classList = "checkbox-li";
        checkbox.type = "checkbox";
        checkbox.classList = "recipe";
        checkbox.name = "ingredients";
        checkbox.value = ingr_nospace.toLowerCase();
        checkbox.id = ingr_nospace.toLowerCase();
        var label = document.createElement('label')
        label.htmlFor = ingr_nospace.toLowerCase();
        label.appendChild(document.createTextNode(ingredients[i]));
        label.classList = "form-x";
        var ingredient = document.getElementById('ingredient');
        ingredient.appendChild(li);
        li.appendChild(checkbox);
        li.appendChild(label);
    }
    const recipes_nodes = document.getElementsByName("recipe_a");
    for (var node of recipes_nodes) {
        var node_id = (node.id);
        var list_ingredients = [];
        for (const key in ingredients_json) {
            if (ingredients_json[key].includes(node_id)) {
                list_ingredients.push(key.split(' ').join('_'));
                node.dataset.ingredients = list_ingredients.join(" ");
            }
        }
    }
});

//---------- GET CATEGORIES JSON ---------
var categories_json;
$.getJSON("https://raw.githubusercontent.com/giuliamanganelli/ragu/main/json/categories.json", function (json) {
    categories_json = json;
});

//---------- POPULATE CATEGORIES CHECKBOX ---------
$(document).ready(function () {
    var categories = (Object.keys(categories_json).sort());
    for (var i = 0; i < categories.length; i++) {
        var cat_nospace = categories[i].split(' ').join('_');
        var li = document.createElement('li');
        var checkbox = document.createElement('input');
        var label = document.createElement('label');
        li.classList = "checkbox-li";
        checkbox.type = "checkbox";
        checkbox.classList = "recipe";
        checkbox.name = "category";
        checkbox.value = cat_nospace.toLowerCase();
        checkbox.id = cat_nospace.toLowerCase();
        var label = document.createElement('label')
        label.htmlFor = cat_nospace.toLowerCase();
        label.classList = "form-x";
        label.appendChild(document.createTextNode(categories[i]));
        var category = document.getElementById('category');
        category.appendChild(li);
        li.appendChild(checkbox);
        li.appendChild(label);
    }
    for (const category in categories_json) {
        const recipe_category = categories_json[category];
        for (const x of recipe_category) {
            const recipes_nodes = document.getElementsByName("recipe_a");
            for (node of recipes_nodes) {
                const node_id = node.id;
                if (node_id == x) {
                    node.dataset.category = category.split(' ').join('_');
                }
            }
        }
    }
});

//---------- CREATE "ALLFILTERS" DATA ATTRIBUTE ---------
$(document).ready(function () {
    const rec = document.getElementsByName("recipe_a");
    for (var i of rec) {
        i.dataset.allfilters = (i.dataset.place) + " " + (i.dataset.ingredients) + " " + (i.dataset.category);
    }
});

//---------- FILTER FUNCTION ---------
$(document).ready(function () {
    var $filterCheckboxes = $('input[type="checkbox"]');
    var filterFunc = function () {
        var selectedFilters = {};
        $filterCheckboxes.filter(':checked').each(function () {
            if (!selectedFilters.hasOwnProperty(this.name)) {
                selectedFilters[this.name] = [];
            }
            selectedFilters[this.name].push(this.value);
        });

        var $filteredResults = $('.recipe_a');
        $.each(selectedFilters, function (name, filterValues) {
            $filteredResults = $filteredResults.filter(function () {
                var matched = false,
                    currentFilterValues = $(this).data('allfilters').split(' ');
                $.each(currentFilterValues, function (_, currentFilterValue) {
                    if ($.inArray(currentFilterValue, filterValues) != -1) {
                        matched = true;
                        return false;
                    }
                });
                return matched;
            });
        });
        $('.recipe_a').hide().filter($filteredResults).show();

        var plc = selectedFilters.place;
        var ingred = selectedFilters.ingredients;
        var cat = selectedFilters.category;
        var x = $('.recipe_a').hide().filter($filteredResults).show();
        var arr_filt = [];

        $("input[type=checkbox]:checked").each(function () {
            arr_filt.push($(this).val());
        });

        $("#btn-compactlist").click(function () {
            $("#compact-ul").html("");
            var $this = $(this);

            if ($this.hasClass('btn-viewfilters')) {
                if (plc != undefined) {
                    $(`#b-place-span`).html(plc.join(" or "));
                }
                else {
                    $(`#b-place-span`).html("no place specified");
                }
                if (ingred != undefined) {
                    $(`#b-ingr-span`).html(ingred.join(" or/and "));
                }
                else {
                    $(`#b-ingr-span`).html("no ingredient specified");
                }
                if (cat != undefined) {
                    $(`#b-cat-span`).html(cat.join(" or "));
                }
                else {
                    $(`#b-cat-span`).html("no category specified");
                }
                $("#breadcrumbs-div").css("display", "block");
                for (var y of x) {
                    var filt = (y.dataset.allfilters);
                    var filt_cat = (y.dataset.category);
                    var filt_plc = (y.dataset.place);
                    var filt_ing = (y.dataset.ingredients);
                    var filt_cat_split = filt_cat.split(" ");
                    var filt_plc_split = filt_plc.split(" ");
                    var filt_ing_split = filt_ing.split(" ");
                    var filt_comp = filt.split(" ");
                    const intersection_ing = arr_filt.filter(element => filt_ing_split.includes(element));
                    const intersection_cat = arr_filt.filter(element => filt_cat_split.includes(element));
                    const intersection_plc = arr_filt.filter(element => filt_plc_split.includes(element));
                    const intersection = arr_filt.filter(element => filt_comp.includes(element));
                    const clone = y.cloneNode(true);
                    var list_rec = $("<li></li>").append(clone);
                    var icon_list = $("<a></a>");
                    var icon = $("<i></i>");
                    $(icon_list).attr('href', '#');
                    $(icon_list).attr('data-toggle', 'tooltip');
                    if (intersection_plc == 0 && intersection_cat == 0 && intersection_ing != 0) {
                        $(icon_list).attr('title', "The recipe contains [" + intersection_ing.join(" and ") + "].");
                    }
                    else if (intersection_plc != 0 && intersection_cat == 0 && intersection_ing == 0) {
                        $(icon_list).attr('title', "The recipe is from [" + intersection_plc + "].");
                    }
                    else if (intersection_plc == 0 && intersection_cat != 0 && intersection_ing == 0) {
                        $(icon_list).attr('title', "The recipe is a [" + intersection_cat + "].");
                    }
                    else if (intersection_plc != 0 && intersection_cat != 0 && intersection_ing == 0) {
                        $(icon_list).attr('title', "The recipe is from [" + intersection_plc + "]" + " and it is a [" + intersection_cat + "].");
                    }
                    else if (intersection_plc != 0 && intersection_cat == 0 && intersection_ing != 0) {
                        $(icon_list).attr('title', "The recipe is from [" + intersection_plc + "]" + " and contains [" + intersection_ing.join(" and ") + "].");
                    }
                    else if (intersection_plc == 0 && intersection_cat != 0 && intersection_ing != 0) {
                        $(icon_list).attr('title', "The recipe contains [" + intersection_ing.join(" and ") + "]" + " and it is a [" + intersection_cat + "].");
                    }
                    else {
                        $(icon_list).attr('title', "This recipe is from [" + intersection_plc + "]" + " , contains [" + intersection_ing.join(" and ") + "]" + " and it is a [" + intersection_cat + "].");
                    }
                    $(icon).attr('class', "fa-regular fa-circle-question icon-list");
                    $(list_rec).attr('id', 'list-recipes-filter');
                    $(icon_list).append(icon);
                    $(list_rec).append(icon_list);
                    $("#compact-ul").append(list_rec);
                }
            }
            else if ($this.hasClass('btn-compactlist')) {
                $("#compact-ul").html("");
                $("#breadcrumbs-div").css("display", "none");
            }
        });

        $("#btn_filter").click(function () {
            $('input[type=checkbox]').prop('checked', false);
            $('.recipe_a').show();
        });

    }
    $filterCheckboxes.on('change', filterFunc);
});


//---------- TOGGLE BETWEEN "VIEW FILTER" & "COMPACT LIST" CLASSES/TEXT---------
$(document).ready(function () {
    $('.btn-compactlist').click(function () {
        var $this = $(this);
        $this.toggleClass('btn-compactlist');
        if ($this.hasClass('btn-compactlist')) {
            $this.text('view compact list');
            $this.removeClass("btn-viewfilters");
        } else {
            $this.text('view filters');
            $this.addClass("btn-viewfilters");
        }
    })
});


//---------- PREPEND/DETACH FILTERS FOR SHOWING COMPACT LIST---------
var el;
$(document).ready(function () {
    $("#btn-compactlist").click(function () {
        $('#filter-sidebar-heading').html("filter by");
        $("#filter-sidebar").css("background-color", "#f8f8f8");
        $("#compact-list").html("");
        if (el) {
            $(".ul-reset").prepend(el);
            el = null;
        } else {
            el = $(".filter-item").detach();
            $('#filter-sidebar-heading').html("filtered recipes");
            $("#filter-sidebar").css("background-color", "#e9dfe1");
        }
    })
});

//---------- RECIPE MODAL ---------
$(document).ready(function () {
    $("body").on("click", ".recipe_a", function (ev) {
        ev.preventDefault();
        var modalToOpen = $(this).attr("href");
        $(modalToOpen).modal('show');
        let id_rec = this.attributes[`id`].value;
        $.getJSON(`https://raw.githubusercontent.com/giuliamanganelli/ragu/main/json/notebook_dina.json`, function (modal_recipes) {
            var notebook_recipes = modal_recipes.recipes;
            let month = notebook_recipes.filter(function (data) { return data.id === id_rec; });
            var notebook_provenance = modal_recipes.provenance;
            var from_year = modal_recipes.fromYear;
            if (from_year == "") {
                from_year = "n/s";
            }
            var to_year = modal_recipes.toYear;
            if (to_year == "") {
                to_year = "n/s";
            }
            var author = modal_recipes.author;
            if (author == "") {
                author = "unknown";
            }
            var notebook_title = modal_recipes.notebookTitle;
            if (notebook_title == "") {
                notebook_title = "n/s";
            }
            var donor = (notebook_provenance[0].donor);
            if (donor == "") {
                donor = "unknown";
            }
            var dateOfFinding = (notebook_provenance[0].dateOfFinding);
            if (dateOfFinding == "") {
                dateOfFinding = "n/s";
            }
            var placeOfFinding = (notebook_provenance[0].placeOfFinding);
            if (placeOfFinding == "") {
                placeOfFinding = "n/s";
            }
            var regionOfFinding = (notebook_provenance[0].region);
            if (regionOfFinding == "") {
                regionOfFinding = "n/s";
            }
            var countryOfFinding = (notebook_provenance[0].country);
            if (countryOfFinding == "") {
                countryOfFinding = "n/s";
            }
            var city = (notebook_provenance[0].city);
            if (city == "") {
                city = "n/s";
            }
            $(`#recipe-info`).html("This recipe was kindly donated by" + " <i>" + donor + "</i>," + " found the " + " <b>" + dateOfFinding + "</b> " + "in" + " <b>" + placeOfFinding + "</b> " + "(" + regionOfFinding + "," + " " + " " + countryOfFinding + ")" + ".");
            var recipes_values = (Object.values(month));
            var title_rec = (recipes_values[0].recipeTitle);
            var title_chapt = (recipes_values[0].chapter);
            var serves = (recipes_values[0].numberOfPersons);
            $(`#serves-bold`).html(serves + " people");
            if (serves == "") {
                $(`#serves-bold`).html("n/s");
            }
            var preparation = (recipes_values[0].recipeTime);
            var preparation_list = [];
            for (var i of preparation) {
                preparation_list.push(i + " " + "min")

            }
            var preparation_join = preparation_list.join(", ");
            $(`#preparation-bold`).html(preparation_join);
            if (preparation_join == "") {
                $(`#preparation-bold`).html("n/s");
            }
            var cooking = (recipes_values[0].cookingTime);
            var cooking_list = [];
            for (var x of cooking) {
                cooking_list.push(x + " " + "min")

            }
            var cooking_join = cooking_list.join(", ");
            $(`#cooking-bold`).html(cooking_join);
            if (cooking_join == "") {
                $(`#cooking-bold`).html("n/s");
            }
            var course = (recipes_values[0].course);
            var ingredients_dict = (recipes_values[0].ingredients);

            var list_procedure = (recipes_values[0].cookingProcedure);
            if (list_procedure != []) {
                for (var procedure of list_procedure) {

                    var cook_procedure = document.createElement('li');
                    const ul_procedure = document.getElementById('cook-list');
                    cook_procedure.appendChild(document.createTextNode(procedure));
                    ul_procedure.appendChild(cook_procedure);
                }
            }

            for (var ingr of ingredients_dict) {
                var list_ingr = document.createElement('li');
                const ul_ingredients = document.getElementById('ingr-list');
                var alt_ingr = (ingr.alternativeIngredient);
                var alt_ingr_name = (alt_ingr[0].alternativeIngredientName);
                var ingr_name = ingr.ingredientName;
                var ingr_qual = ingr.ingredientQualifier;
                var dosage = ingr.dosage[0].quantity + " " + ingr.dosage[0].unitOfMeasure + " | ";
                if (ingr.dosage[0].quantity == "") {
                    dosage = ""
                }
                var ingr_complete = dosage + ingr_name + " (" + ingr_qual + ") or " + alt_ingr_name;
                if (alt_ingr_name == "" && ingr_qual != "") {
                    var ingr_complete = dosage + ingr_name + " (" + ingr_qual + ")";
                }
                else if (alt_ingr_name != "" && ingr_qual == "") {
                    var ingr_complete = dosage + ingr_name + " or " + alt_ingr_name;
                }
                else if (alt_ingr_name == "" && ingr_qual == "") {
                    var ingr_complete = dosage + ingr_name;
                }
                list_ingr.appendChild(document.createTextNode(ingr_complete));
                ul_ingredients.appendChild(list_ingr);
            }
            $(`#recipe-title`).html(title_rec + " " + "|" + " " + course);
            $(`#recipe-subtitle`).html(author + "," + " " + "<i>" + notebook_title + " " + "(ch. " + " " + title_chapt + ")" + "</i>" + "," + " " + city + " " + "(" + regionOfFinding + "," + " " + " " + countryOfFinding + ")" + "," + " " + "years" + " " + "<i>" + "(" + from_year + " - " + to_year + ")." + "</i>");

            $(".btn-close").click(function () {
                $("#myModal").modal('hide');
                $('#ingr-list').html('');
                $('#cook-list').html('');
            });
        });
    });
});












