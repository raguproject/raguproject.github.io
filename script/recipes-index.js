fetch("/json/alphabet.json")
    .then(function (resp) {
        return resp.json();
    })

    .then(function (alphabet_json) {

        for (const i in alphabet_json) {
            const links = alphabet_json[i];
            const div = document.getElementById('letter_space');
            const ol = document.createElement('ol');
            ol.classList = "index_letters";
            ol.classList.add("col-6");
            ol.appendChild(document.createTextNode(i));

            for (const link in links) {
                const ids = links[link];
                const a = document.createElement('a');
                a.appendChild(document.createTextNode(ids));
                a.id = link;
                a.name = "recipe_a";
                a.classList = "recipe_a";
                a.href = "#myModal";
                a.dataset.toggle = "modal";
                a.dataset.target = "modal";


                /*a.dataset.toggle = "modal";
                a.href = "#myModal";*/

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
        var cities = (Object.keys(provenance_json));

        for (var i = 0; i < cities.length; i++) {
            var div = document.createElement('div');
            var checkbox = document.createElement('input');
            var label = document.createElement('label');
            div.classList = "checkbox-div";
            checkbox.type = "checkbox";
            checkbox.classList = "recipe";
            checkbox.name = "place";
            checkbox.value = cities[i].toLowerCase();
            checkbox.id = cities[i].toLowerCase();
            var label = document.createElement('label')
            label.htmlFor = cities[i];
            label.classList = "form-x";
            label.appendChild(document.createTextNode(cities[i]));
            var provenance = document.getElementById('provenance');
            provenance.appendChild(div);
            div.appendChild(checkbox);
            div.appendChild(label);
        }

        for (const city in provenance_json) {
            const recipe_city = provenance_json[city];
            for (const x of recipe_city) {
                const recipes_nodes = document.getElementsByName("recipe_a");
                for (node of recipes_nodes) {
                    const node_id = node.id;
                    if (node_id == x) {
                        node.dataset.place = city.toLowerCase();
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
        var ingredients = (Object.keys(ingredients_json));

        for (var i = 0; i < ingredients.length; i++) {
            var div = document.createElement('div');
            var checkbox = document.createElement('input');
            var label = document.createElement('label');
            div.classList = "checkbox-div";
            checkbox.type = "checkbox";
            checkbox.classList = "recipe";
            checkbox.name = "ingredients";
            checkbox.value = ingredients[i].toLowerCase();
            checkbox.id = ingredients[i].toLowerCase();
            var label = document.createElement('label')
            label.htmlFor = ingredients[i];
            label.appendChild(document.createTextNode(ingredients[i]));
            label.classList = "form-x";
            var ingredient = document.getElementById('ingredient');
            ingredient.appendChild(div);
            div.appendChild(checkbox);
            div.appendChild(label);

        }

        const recipes_nodes = document.getElementsByName("recipe_a");
        for (var node of recipes_nodes) {
            var node_id = (node.id);
            var list_ingredients = [];
            for (const key in ingredients_json) {
                if (ingredients_json[key].includes(node_id)) {
                    list_ingredients.push(key);
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
        var categories = (Object.keys(categories_json));

        for (var i = 0; i < categories.length; i++) {
            var div = document.createElement('div');
            var checkbox = document.createElement('input');
            var label = document.createElement('label');
            div.classList = "checkbox-div";
            checkbox.type = "checkbox";
            checkbox.classList = "recipe";
            checkbox.name = "category";
            checkbox.value = categories[i].toLowerCase();
            checkbox.id = categories[i].toLowerCase();
            var label = document.createElement('label')
            label.htmlFor = categories[i];
            label.classList = "form-x";
            label.appendChild(document.createTextNode(categories[i]));
            var category = document.getElementById('category');
            category.appendChild(div);
            div.appendChild(checkbox);
            div.appendChild(label);


        }

        for (const category in categories_json) {
            const recipe_category = categories_json[category];
            for (const x of recipe_category) {
                const recipes_nodes = document.getElementsByName("recipe_a");
                for (node of recipes_nodes) {
                    const node_id = node.id;
                    if (node_id == x) {
                        node.dataset.category = category;
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
            console.log(selectedFilters);
            // create a collection containing all of the filterable elements
            var $filteredResults = $('.recipe_a');
            console.log($filteredResults);

            // loop over the selected filter name -> (array) values pairs
            $.each(selectedFilters, function (name, filterValues) {
                $filteredResults = $filteredResults.filter(function () {
                    var matched = false,
                        currentFilterValues = $(this).data("allfilters").split(' ');
                    console.log(currentFilterValues);

                    // loop over each category value in the current .flower's data-category
                    $.each(currentFilterValues, function (_, currentFilterValue) {

                        // if the current category exists in the selected filters array
                        // set matched to true, and stop looping. as we're ORing in each
                        // set of filters, we only need to match once

                        if ($.inArray(currentFilterValue, filterValues) != -1) {
                            matched = true;
                            // return false;
                        }
                    });

                    // if matched is true the current .flower element is returned
                    return matched;

                });
            });

            $('.recipe_a').hide().filter($filteredResults).show();
        }

        $filterCheckboxes.on('change', filterFunc);



        jQuery(function ($) {

            $("body").on("click", ".recipe_a", function (ev) {
                ev.preventDefault();
                var modalToOpen = $(this).attr("href");
                $(modalToOpen).modal('show');

            });
            $(".btn-close").click(function () {
                $("#myModal").modal('hide');

            });
        });

    });











