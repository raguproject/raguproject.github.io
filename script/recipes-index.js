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
            ol.appendChild(document.createTextNode(i));

            for (const link in links) {
                const ids = links[link];
                const a = document.createElement('a');
                a.appendChild(document.createTextNode(ids));

                a.id = link;
                a.name = "recipe_a";
                a.classList = "recipe_a";
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

            var checkbox = document.createElement('input');
            var label = document.createElement('label');
            checkbox.type = "checkbox";
            checkbox.classList = "recipe";
            checkbox.name = "place";
            checkbox.value = cities[i].toLowerCase();
            checkbox.id = cities[i].toLowerCase();
            var label = document.createElement('label')
            label.htmlFor = cities[i];
            label.appendChild(document.createTextNode(cities[i]));
            var provenance = document.getElementById('provenance');
            provenance.appendChild(checkbox);
            provenance.appendChild(label);
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
            var checkbox = document.createElement('input');
            var label = document.createElement('label');
            checkbox.type = "checkbox";
            checkbox.classList = "recipe";
            checkbox.name = "ingredients";
            checkbox.value = ingredients[i].toLowerCase();
            checkbox.id = ingredients[i].toLowerCase();
            var label = document.createElement('label')
            label.htmlFor = ingredients[i];
            label.appendChild(document.createTextNode(ingredients[i]));
            var ingredient = document.getElementById('ingredient');
            ingredient.appendChild(checkbox);
            ingredient.appendChild(label);

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
            var checkbox = document.createElement('input');
            var label = document.createElement('label');
            checkbox.type = "checkbox";
            checkbox.classList = "recipe";
            checkbox.name = "category";
            checkbox.value = categories[i].toLowerCase();
            checkbox.id = categories[i].toLowerCase();
            var label = document.createElement('label')
            label.htmlFor = categories[i];
            label.appendChild(document.createTextNode(categories[i]));
            var category = document.getElementById('category');
            category.appendChild(checkbox);
            category.appendChild(label);


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
            selectedFilters["allfilters"] = [];
            $filterCheckboxes.filter(':checked').each(function () {

                if (!selectedFilters.hasOwnProperty(this.name)) {
                    //selectedFilters[this.name] = [];
                }

                //selectedFilters[this.name].push(this.value);
                selectedFilters["allfilters"].push(this.value);

            });


            var $filteredResults = $('.recipe_a');
            // variabile di tutte le ricette filtrabili 
            $.each(selectedFilters, function (name, filterValues) {

                //console.log(selectedFilters);
                // console.log(name);
                //console.log(filterValues);

                // fa un loop nell'array dei valori dei filtri selezionati

                $filteredResults = $filteredResults.filter(function () {
                    //console.log($filteredResults); // filtra ogni ricetta

                    var matched = false,
                        currentFilterValues = $(this).data("allfilters").split(' ');

                    $.each(currentFilterValues, function (_, currentFilterValue) {
                        //console.log(currentFilterValues);

                        //loop su ogni ingredients value di data-ingredients in recipe_a

                        // se l'ingredient c'è nell'array 
                        // matched = true
                        if ($.inArray(currentFilterValue, filterValues) != -1) {
                            //console.log(currentFilterValue);
                            console.log(filterValues);

                            matched = true;

                            //console.log(matched);
                        }

                        if (filterValues.length == 0) {
                            matched = true;
                        }

                    });

                    return matched;


                    // se matched = true l'elemento la recipe_a è returned

                });

            });

            $('.recipe_a').hide().filter($filteredResults).show();
        }

        $filterCheckboxes.on('change', filterFunc);



    })







