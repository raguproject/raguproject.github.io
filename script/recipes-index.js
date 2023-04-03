fetch("/json/alphabet.json")
    .then(function (resp) {
        return resp.json();
    })

    .then(function (alphabet_json) {

        for (const i in alphabet_json) {
            const links = alphabet_json[i];

            //console.log(Object.values(links).sort());
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

    })


fetch("/json/provenance.json")
    .then(function (resp) {
        return resp.json();
    })
    .then(function (provenance_json) {
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
    })

fetch("/json/ingredients.json")
    .then(function (resp) {
        return resp.json();
    })
    .then(function (ingredients_json) {
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
    })


fetch("/json/categories.json")
    .then(function (resp) {
        return resp.json();
    })
    .then(function (categories_json) {
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

        const rec = document.getElementsByName("recipe_a");
        for (var i of rec) {
            i.dataset.allfilters = (i.dataset.place) + " " + (i.dataset.ingredients) + " " + (i.dataset.category);
        }
        var $filterCheckboxes = $('input[type="checkbox"]');

        var filterFunc = function () {
            var selectedFilters = {};
            $filterCheckboxes.filter(':checked').each(function () {
                if (!selectedFilters.hasOwnProperty(this.name)) {
                    selectedFilters[this.name] = [];
                }
                selectedFilters[this.name].push(this.value);
            });

            // create a collection containing all of the filterable elements
            var $filteredResults = $('.recipe_a');
            // loop over the selected filter name -> (array) values pairs
            $.each(selectedFilters, function (name, filterValues) {
                $filteredResults = $filteredResults.filter(function () {
                    var matched = false,
                        currentFilterValues = $(this).data("allfilters").split(' ');

                    // loop over each category value in the current .flower's data-category
                    $.each(currentFilterValues, function (_, currentFilterValue) {


                        // if the current category exists in the selected filters array
                        // set matched to true, and stop looping. as we're ORing in each
                        // set of filters, we only need to match once

                        if ($.inArray(currentFilterValue, filterValues) != -1) {
                            matched = true;
                            return false;
                        }
                    });
                    return matched;

                });
            });

            $('.recipe_a').hide().filter($filteredResults).show();
            var x = $('.recipe_a').hide().filter($filteredResults).show();

            $("#btn-compactlist").click(function () {
                $("#compact-ul").html("");
                var $this = $(this);

                if ($this.hasClass('btn-viewfilters')) {
                    for (var y of x) {
                        const clone = y.cloneNode(true);
                        var list_rec = $("<li></li>").append(clone);
                        $(list_rec).attr('id', 'list-recipes-filter');
                        $("#compact-ul").append(list_rec);
                    }
                }

                else if ($this.hasClass('btn-compactlist')) {
                    $("#compact-ul").html("");
                }
            })


            var plc = selectedFilters.place;
            var ingred = selectedFilters.ingredients;
            var cat = selectedFilters.category;

            $("#btn-compactlist").click(function () {
                var $this = $(this);

                if ($this.hasClass('btn-viewfilters')) {
                    if (plc != undefined) {
                        $(`#b-place-span`).html(plc.join(" or "));
                    }
                    else {
                        $(`#b-place-span`).html("no place specified");
                    }
                    if (ingred != undefined) {
                        $(`#b-ingr-span`).html(ingred.join(" or "));
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
                }

                else if ($this.hasClass('btn-compactlist')) {
                    $("#breadcrumbs-div").css("display", "none");

                }
            })


            /*
                        $("#btn-compactlist").click(function () {
                            var $this = $(this);
            
                            if ($this.hasClass('btn-viewfilters')) {
                                $("#breadcrumbs").html("");
                                var ingredients_breadcrumb = selectedFilters.ingredients;
            
                                if (ingredients_breadcrumb != []) {
                                    set_ing_bread = new Set()
                                    for (var ing of ingredients_breadcrumb) {
                                        set_ing_bread.add(ing);
                                    }
                                    var breadcrumb_with = $("<p></p>").append("with: ");
                                    for (var b of set_ing_bread) {
                                        breadcrumb_with.append(b + " ");
                                    }
                                    $("#breadcrumbs").append(breadcrumb_with);
                                    $(breadcrumb_with).attr('id', 'bread_with');
                                }
                            }
            
                            else if ($this.hasClass('btn-compactlist')) {
                                $("#breadcrumbs").html("");
            
                            }
                        })*/


            $("#btn_filter").click(function () {
                $('input[type=checkbox]').prop('checked', false);
                $('.recipe_a').show();
            })
        }

        $filterCheckboxes.on('change', filterFunc);


        jQuery(function ($) {

            $("body").on("click", ".recipe_a", function (ev) {
                ev.preventDefault();
                var modalToOpen = $(this).attr("href");
                $(modalToOpen).modal('show');
                let id_rec = this.attributes[`id`].value;
                $.getJSON(`/json/notebook_dina.json`, function (modal_recipes) {
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

        });


        var el;
        $("#btn-compactlist").click(function () {
            $('#filter-sidebar-heading').html("filter by");
            $("#filter-sidebar").css("background-color", "#f8f8f8");
            $("#compact-list").html("");
            if (el) {
                $(".ul-reset").prepend(el);
                el = null;


            } else {
                el = $(".filter-item").detach();
                /*var h3_txt = $("<h3></h3>").text("your filtered recipes");
                $("#compact-list").append(h3_txt);
                $(h3_txt).attr('id', 'h3-compactlist');*/
                $('#filter-sidebar-heading').html("filtered recipes");
                $("#filter-sidebar").css("background-color", "#e9dfe1");
            }


        });







    });
















