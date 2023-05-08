
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
        const h1 = document.createElement('h1');
        h1.id = "letters_title";
        ol.classList = "index_letters";
        ol.classList.add("col-6");
        ol.appendChild(h1);
        h1.appendChild(document.createTextNode(i));
        var entries = (Object.entries(links))
        //var val_ord = Object.values(links).sort();
        // var keys_ord = Object.keys(links).sort();
        for (const link of entries) {
            const ids = link[1];
            const a = document.createElement('a');
            a.appendChild(document.createTextNode(ids));
            a.id = link[0];
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

//---------- FILTER FUNCTION + POPULATE COMPACT LIST ---------
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


            $("#btn-compactlist").click(function () {
                $("#compact-ul").html("");
                $("#compact-ul").css("padding", "0");
                $("#compact").css("height", "0");
                $("#compact").css("padding", "0");
                $("#compact").css("margin-top", "0");
                $("#compact").css("box-shadow", "none");


                var $this = $(this);
                if ($this.hasClass('btn-viewfilters')) {
                    $("#compact").css("height", "200px");
                    $("#compact").css("padding", "5%");
                    $("#compact").css("margin-top", "5%");
                    $("#compact-ul").css("padding", "5%");

                    $("#compact").css("box-shadow", "inset 6px 6px 10px 0 rgba(0, 0, 0, 0.2), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.5)");
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
                    $("#compact").css("height", "0");
                    $("#compact").css("padding", "0");
                    $("#compact").css("margin-top", "0");
                    $("#compact").css("box-shadow", "none");
                    $("#compact-ul").css("padding", "0");

                    $("#breadcrumbs-div").css("display", "none");
                }
            });
        });

        //----------RESET FILTERS BUTTON---------
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
            $this.text('RESULTS LIST');
            $this.removeClass("btn-viewfilters");
        } else {
            $this.text('GO BACK TO FILTERS');
            $this.addClass("btn-viewfilters");
        }
    })
});


//---------- PREPEND/DETACH FILTERS FOR SHOWING COMPACT LIST---------
var el;
$(document).ready(function () {
    $("#btn-compactlist").click(function () {
        $("#btn_filter").show();
        $('#filter-sidebar-heading').html("filter by");
        $("#filter-sidebar").css("background-color", "#f8f8f8");
        $("#compact-list").html("");
        if (el) {
            $(".ul-reset").prepend(el);
            el = null;
        } else {
            el = $(".filter-item").detach();
            $("#btn_filter").hide();
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
        var general_json;
        $.getJSON("/json/general.json", function (json) {
            general_json = json;
            var notebooks = general_json.notebooks;
            var notebooks_json = Object.values(notebooks);

            for (var nb of notebooks_json) {
                var get_json = $.getJSON("/json/" + nb);
                //accedo ai ricettari
                var modal_recipes = get_json.responseJSON;
                //accedo agli id dei ricettari (quaderno_2_29ago2019_sara_fornaciari)
                var id_nb = modal_recipes.id;
                //accedo all'id della ricetta e lo splitto al __
                var id_rec_split = id_rec.split("__");
                var cookbook = id_rec_split[0];
                var recipe_number = id_rec_split[1];
                if (cookbook == id_nb) {
                    var notebook_recipes = modal_recipes.recipes;
                    var recipe_dict = (notebook_recipes[recipe_number]);
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

                    var donor = (notebook_provenance.donor);
                    if (donor == "") {
                        donor = "unknown";

                    }
                    var dateOfFinding = (notebook_provenance.dateOfFinding);
                    if (dateOfFinding == "") {
                        dateOfFinding = "n/s";
                    }
                    var placeOfFinding = (notebook_provenance.placeOfFinding);
                    if (placeOfFinding == "") {
                        placeOfFinding = "n/s";
                    }
                    var regionOfFinding = (notebook_provenance.region);
                    if (regionOfFinding == "") {
                        regionOfFinding = "n/s";
                    }
                    var countryOfFinding = (notebook_provenance.country);
                    if (countryOfFinding == "") {
                        countryOfFinding = "n/s";
                    }
                    var city = (notebook_provenance.city);
                    if (city == "") {
                        city = "n/s";
                    }
                    $(`#recipe-info`).html("This recipe was kindly donated by" + " <i>" + donor + "</i>," + " found the " + " <b>" + dateOfFinding + "</b> " + "in" + " <b>" + placeOfFinding + "</b> " + "(" + regionOfFinding + "," + " " + " " + countryOfFinding + ")" + ".");

                    var title_rec = (recipe_dict.recipeTitle);
                    var title_chapt = (recipe_dict.chapter);
                    if (title_chapt == "") {
                        title_chapt = "n/s";
                    }
                    var serves = (recipe_dict.numberOfPersons);
                    $(`#serves-bold`).html(serves + " people");
                    if (serves == "") {
                        $(`#serves-bold`).html("n/s");
                    }
                    var preparation = (recipe_dict.recipeTime);
                    var preparation_list = [];
                    for (var i of preparation) {
                        if (i != "") {
                            preparation_list.push(i + " " + "min")
                        }
                    }

                    var preparation_join = preparation_list.join(", ");
                    $(`#preparation-bold`).html(preparation_join);
                    if (preparation_join == "") {
                        $(`#preparation-bold`).html("n/s");
                    }


                    var pages = (recipe_dict.pagesNumber);
                    var pages_list = [];
                    for (var p of pages) {
                        pages_list.push(p)
                    }

                    var pages_join = pages_list.join("-");
                    if (pages_join == "") {
                        pages_join = "n/s";
                    }


                    var cooking = (recipe_dict.cookingTime);
                    var cooking_list = [];
                    for (var x of cooking) {
                        if (x != "") {
                            cooking_list.push(x + " " + "min")
                        }

                    }
                    var cooking_join = cooking_list.join(", ");
                    $(`#cooking-bold`).html(cooking_join);
                    if (cooking_join == "") {
                        $(`#cooking-bold`).html("n/s");
                    }

                    var temp = (recipe_dict.temperature);
                    var temp_list = [];
                    for (var t of temp) {
                        if (t != "") {
                            temp_list.push(t)
                        }

                    }
                    var temp_join = temp_list.join(", ");
                    $(`#temperature-bold`).html(temp_join);
                    if (temp_join == "") {
                        $(`#temperature-bold`).html("n/s");
                    }

                    var course = recipe_dict.course;
                    var ingredients_dict = (recipe_dict.ingredients);
                    var list_procedure = (recipe_dict.cookingProcedure);
                    if (list_procedure != []) {
                        for (var procedure of list_procedure) {
                            if (procedure != "") {
                                var cook_procedure = document.createElement('li');
                                const ul_procedure = document.getElementById('cook-list');
                                cook_procedure.appendChild(document.createTextNode(procedure));
                                ul_procedure.appendChild(cook_procedure);
                            }
                        }
                    }

                    var recipe_img = recipe_dict.img;

                    for (var img of recipe_img) {
                        var img_tag = $("<img>");
                        $(img_tag).attr("src", "../recipe_photos/" + img);
                        $(img_tag).attr("id", "photo_recipe");
                        $(img_tag).addClass("fade-in");
                        img_tag.appendTo('#recipe-image');

                    }

                    for (var ingr of ingredients_dict) {
                        var list_ingr = document.createElement('li');
                        const ul_ingredients = document.getElementById('ingr-list');
                        var span = document.createElement('span');
                        span.id = "var-italic";
                        var span_bold = document.createElement('span');
                        span_bold.id = "var-bold";
                        var var_list = document.createElement('li');
                        const var_ul = document.getElementById('var_list');
                        var alt_ingr = (ingr.alternativeIngredient);
                        var alt_ingr_name = (alt_ingr[0].alternativeIngredientName);
                        var alt_ingr_qual = (alt_ingr[0].alternativeIngredientQualifier);
                        var ingr_name = ingr.ingredientName;
                        var variant_name = ingr.variantIngredientName;
                        var ingr_qual = ingr.ingredientQualifier;
                        var dosage = ingr.dosage.quantity + " " + ingr.dosage.unitOfMeasure + " | ";
                        if (ingr.dosage.quantity == "") {
                            dosage = ""
                        }
                        var ingr_complete = dosage + ingr_name + " (" + ingr_qual + ") or " + alt_ingr_name;

                        if (alt_ingr_name == "" && ingr_qual != "" && variant_name != "") {
                            var ingr_complete = dosage + ingr_name + " * (" + ingr_qual + ")";
                        }
                        else if (alt_ingr_name == "" && ingr_qual != "" && variant_name == "") {
                            var ingr_complete = dosage + ingr_name + " (" + ingr_qual + ")";
                        }
                        else if (alt_ingr_name != "" && alt_ingr_qual != "" && ingr_qual == "" && variant_name != "") {
                            var ingr_complete = dosage + ingr_name + " * or " + alt_ingr_name + " (" + alt_ingr_qual + ")";
                        }
                        else if (alt_ingr_name != "" && alt_ingr_qual != "" && ingr_qual != "" && variant_name == "") {
                            var ingr_complete = dosage + ingr_name + " (" + ingr_qual + ")" + " or " + alt_ingr_name + " (" + alt_ingr_qual + ")";
                        }
                        else if (alt_ingr_name != "" && alt_ingr_qual == "" && ingr_qual == "" && variant_name != "") {
                            var ingr_complete = dosage + ingr_name + " * or " + alt_ingr_name;
                        }

                        else if (alt_ingr_name != "" && ingr_qual == "" && alt_ingr_qual == "" && variant_name == "") {
                            var ingr_complete = dosage + ingr_name + " or " + alt_ingr_name;
                        }
                        else if (alt_ingr_name != "" && ingr_qual == "" && alt_ingr_qual != "" && variant_name == "") {
                            var ingr_complete = dosage + ingr_name + " or " + alt_ingr_name + " (" + alt_ingr_qual + ")";
                        }
                        else if (alt_ingr_name == "" && ingr_qual == "" && variant_name != "") {
                            var ingr_complete = dosage + ingr_name + " *";
                        }
                        else if (alt_ingr_name == "" && ingr_qual == "" && variant_name == "") {
                            var ingr_complete = dosage + ingr_name;
                        }

                        list_ingr.appendChild(document.createTextNode(ingr_complete));
                        ul_ingredients.appendChild(list_ingr);
                        if (variant_name != "") {
                            span_bold.innerHTML = ingr_name;
                            span.innerHTML = variant_name;
                            var_list.appendChild(document.createTextNode("* "))
                            var_list.appendChild(span_bold);
                            var_list.appendChild(document.createTextNode(" is also known as [ "));
                            var_list.appendChild(span);
                            var_list.appendChild(document.createTextNode(" ]"));
                            var_ul.appendChild(var_list);
                        }

                    }

                    $(`#recipe-title`).html(title_rec + " " + "|" + " " + course);
                    $(`#recipe-subtitle`).html(author + "," + " " + "<b>" + notebook_title + "</b>" + ", p. " + pages_join + ", " + "<i>" + "(ch. " + " " + title_chapt + ")" + "</i>" + "," + " " + city + " " + "(" + regionOfFinding + "," + " " + " " + countryOfFinding + ")" + "," + " " + "years" + " " + "<i>" + "[" + from_year + " - " + to_year + "]." + "</i>");

                    $(".btn-close").click(function () {
                        $("#myModal").modal('hide');
                        $('#ingr-list').html('');
                        $('#cook-list').html('');
                        $('#var_list').html('');
                        $('#recipe-image').html('');
                    });


                }
                else {
                    ""
                }
            }
        });
    });
});












