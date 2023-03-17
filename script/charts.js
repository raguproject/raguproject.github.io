// ----------- COUNTER -------------

fetch("/json/counter.json")
    .then(function (resp) {
        return resp.json();
    })

    .then(function (counter_json) {
        var cookbooks = (counter_json["cookbooks"]);
        var recipes = (counter_json["recipes"]);
        var ingredients = (counter_json["ingredients"]);
        const span_cook = document.getElementById('counter-cookbook');
        span_cook.dataset.count = cookbooks;
        const span_rec = document.getElementById('counter-recipe');
        span_rec.dataset.count = recipes;
        const span_ingr = document.getElementById('counter-ingredient');
        span_ingr.dataset.count = ingredients;
    })

var a = 0;
$(window).scroll(function () {
    var oTop = $('#counter').offset().top - window.innerHeight;
    if (a == 0 && $(window).scrollTop() > oTop) {
        $('.counter-value').each(function () {
            var $this = $(this),
                countTo = $this.attr('data-count');
            $({
                countNum: $this.text()
            }).animate({
                countNum: countTo
            },
                {
                    duration: 3000,
                    easing: 'swing',
                    step: function () {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function () {
                        $this.text(this.countNum);
                        //alert('finished');
                    }
                });
        });
        a = 1;
    }
});




// ----------- MAP -------------

am5.ready(function () {
    var root = am5.Root.new("chartdiv_map");

    var myTheme = am5.Theme.new(root);
    myTheme.rule("ColorSet").set("colors", [
        am5.color("#cc0b36"),
        am5.color("#c6596e"),
        am5.color("#e0715f"),
        am5.color("#823c30"),
        am5.color("#aa6a7e"),
        am5.color("#c99975"),
        am5.color("#e885a1"),
        am5.color("#332421")
    ]);
    root.setThemes([
        am5themes_Animated.new(root),
        myTheme
    ]);

    var chart = root.container.children.push(
        am5map.MapChart.new(root, {
            panX: "rotateX",
            panY: "translateY",
            projection: am5map.geoMercator()
        })
    );

    var backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
        fill: am5.color("#cc0b36"),
        fillOpacity: 0,
        strokeOpacity: 0
    });

    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,

        })
    );

    polygonSeries.mapPolygons.template.setAll({
        fill: am5.color("#cc0b36"),
        fillOpacity: 0.10,
        strokeWidth: 0.5,
        stroke: root.interfaceColors.get("background")
    });

    var colorset = am5.ColorSet.new(root, {});
    var circleTemplate = am5.Template.new({});
    var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {
        calculateAggregates: true,
        valueField: "value"
    }));

    pointSeries.bullets.push(function () {
        var container = am5.Container.new(root, {});

        var circle = container.children.push(
            am5.Circle.new(root, {
                radius: 5,
                tooltipY: 0,
                fill: colorset.next(),
                strokeOpacity: 0,
                tooltipText: "{title} {value}" + "recipes"
            })
        );

        return am5.Bullet.new(root, {
            sprite: container
        });
    });

    pointSeries.set("heatRules", [{
        target: circleTemplate,
        min: 3,
        max: 30,
        key: "radius",
        dataField: "value"
    }]);

    $.getJSON("/json/map.json", function (json) {
        cities = json;

        for (var i = 0; i < cities.length; i++) {
            var city = cities[i];
            addCity(city.longitude, city.latitude, city.title, city.value);
        }

        function addCity(longitude, latitude, title, value) {
            pointSeries.data.push({
                geometry: { type: "Point", coordinates: [longitude, latitude] },
                title: title + ":" + " " + value
            });
        }

    })
    chart.appear(1000, 100);
});




// ----------- NETWORK -------------

am5.ready(function () {

    var root = am5.Root.new("chartdiv_ingredients");
    var myTheme = am5.Theme.new(root);

    myTheme.rule("ColorSet").set("colors", [
        am5.color("#cc0b36"),
        am5.color("#c6596e"),
        am5.color("#e0715f"),
        am5.color("#823c30"),
        am5.color("#aa6a7e"),
        am5.color("#c99975"),
        am5.color("#e885a1")
    ]);
    root.setThemes([
        am5themes_Animated.new(root),
        myTheme
    ]);
    var container = root.container.children.push(
        am5.Container.new(root, {
            width: am5.percent(100),
            height: am5.percent(100),
            layout: root.verticalLayout
        })
    );

    var series = container.children.push(
        am5hierarchy.ForceDirected.new(root, {
            downDepth: 1,
            initialDepth: 2,
            valueField: "value",
            categoryField: "name",
            childDataField: "children",
            minRadius: 15,
            maxRadius: am5.percent(12),
            centerStrength: 0.5,
            manyBodyStrength: -15,

        })
    );



    $.getJSON("/json/network.json", function (json) {
        network = json;
        series.data.setAll(network);
        series.set("selectedDataItem", series.dataItems[0]);

    })
    chart.appear(1000, 100);
});



// ----------- PIE CHART (PERSONALIZED PICTOGRAM) -------------

am5.ready(function () {

    var root = am5.Root.new("chartdiv_pie");
    var myTheme = am5.Theme.new(root);
    myTheme.rule("ColorSet").set("colors", [
        am5.color("#cc0b36"),
        am5.color("#c6596e"),
        am5.color("#e0715f"),
        am5.color("#823c30"),
        am5.color("#aa6a7e"),
        am5.color("#c99975"),
        am5.color("#e885a1")
    ]);
    root.setThemes([
        am5themes_Animated.new(root),
        myTheme
    ]);
    var chart = root.container.children.push(am5percent.SlicedChart.new(root, {
        layout: root.verticalLayout
    }));

    var series = chart.series.push(am5percent.PictorialStackedSeries.new(root, {
        alignLabels: true,
        orientation: "vertical",
        valueField: "value",
        categoryField: "category",
        svgPath: "M629.43,291c-23,.9-49.8,3.5-53.5,5.2-3.3,1.6-3.9,6.9-1.2,10.7a23.72,23.72,0,0,1,3.1,6.6c.6,2.1,4,33.6,7.6,69.9s7.1,67.7,7.7,69.8c1.4,4.8,7,11.2,11.8,13.7,20.8,10.6,75.7,12.2,104,3.1,17-5.5,21.2-10.3,23-26.1,1.1-10,8.6-94.6,9.7-108.8.4-5.1,1.2-8.9,2-9.8,1.9-1.9,26.6-2,28-.2.6.7,1.8,9.2,2.8,18.8,4.5,45.4,7.3,66.7,9,69.4,1.9,2.9,6.3,5.6,9.1,5.6,1.5,0,1.6-1.3,1.1-14.3-.4-7.8-1.4-31.1-2.3-51.7s-1.8-38.5-2-39.8c-.7-3.7-11.4-7.2-28.7-9.3-7.7-.9-8.4-1.2-11.3-4.6-4.2-4.9-9.9-5.9-44.9-7.8C674.73,289.81,661.43,289.71,629.43,291Z"
    }));

    series.labelsContainer.set("width", 100);
    series.ticks.template.set("location", 0.6);
    series.labels.template.adapters.add("forceHidden", forceHidden);
    series.ticks.template.adapters.add("forceHidden", forceHidden);

    function forceHidden(hidden, target) {
        return target.dataItem.get("valuePercentTotal") == 0;
    }

    $.getJSON("/json/piechart.json", function (json) {
        piechart = json;
        series.data.setAll(piechart);
    });

    chart.appear(1000, 100);
});




// ----------- MATRIX -------------

am5.ready(function () {
    var root = am5.Root.new("chartdiv");
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            layout: root.verticalLayout
        })
    );

    // Create axes and their renderers
    var yRenderer = am5xy.AxisRendererY.new(root, {
        visible: false,
        minGridDistance: 20,
        inversed: true
    });

    yRenderer.grid.template.set("visible", false);

    var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
            maxDeviation: 0,
            renderer: yRenderer,
            categoryField: "ingr1",

        })
    );

    var xRenderer = am5xy.AxisRendererX.new(root, {
        visible: false,
        minGridDistance: 30,
        opposite: true
    });

    xRenderer.grid.template.set("visible", false);

    var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            renderer: xRenderer,
            categoryField: "ingr2"
        })
    );

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_series
    var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
            calculateAggregates: true,
            stroke: am5.color(0xffffff),
            clustered: false,
            xAxis: xAxis,
            yAxis: yAxis,
            categoryXField: "ingr1",
            categoryYField: "ingr2",
            valueField: "value",


        })
    );

    series.columns.template.setAll({
        forceHidden: true,


    });




    var circleTemplate = am5.Template.new({ radius: 5 });


    // Add circle bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    series.bullets.push(function () {
        var graphics = am5.Circle.new(
            root, {
            stroke: series.set("stroke", am5.color(0xffffff)),
            tooltipText: "[bold]{ingr1}[/] & [bold]{ingr2}[/]: {value} recipes",
            fill: series.set("fill", am5.color("#c6596e"))
        }, circleTemplate
        );
        return am5.Bullet.new(root, {
            sprite: graphics
        });
    });

    series.set("heatRules", [{
        target: circleTemplate,
        min: 10,
        max: 30,
        dataField: "value",
        key: "radius"
    }]);


    $.getJSON("/json/matrix.json", function (json) {
        matrix = json;
        const ingr_cat = new Set();
        for (var m in matrix) {
            for (var x of matrix[m]) {
                ingr_cat.add(x);
            }
        }
        array_nospace = [];
        for (var str of ingr_cat) {
            var str_nospace = str.split(' ').join('_');
            array_nospace.push(str_nospace);
        }
        var pairs_array = array_nospace.reduce((acc, v, i) =>
            acc.concat(array_nospace.slice(i + 1).map(w => v + ' ' + w)),
            []);
        for (var el of pairs_array) {
            array = [];
            array.push(el);
        }
        const obj_array = new Array();
        for (var pair of pairs_array) {
            const obj = new Object();
            var ingr = pair.split(" ");
            obj.ingr1 = ingr[0].split('_').join(' ');
            obj.ingr2 = ingr[1].split('_').join(' ');
            obj.value = 0;
            obj_array.push(obj);
        }
        var first_list = []
        for (var obj of obj_array) {
            var val = (Object.values(obj));
            var eliminate = val.pop();
            first_list.push(val);
        }
        arrays_couples = [];
        var second_list = ((Object.values(matrix)));
        for (var x of second_list) {

            for (var y of first_list) {
                let checkSubset = (parentArray, subsetArray) => {
                    return subsetArray.every((el) => {
                        return parentArray.includes(el);
                    })
                }
                var f = checkSubset(x, y);
                arr = [y, f];
                if (arr[1] == true) {
                    arrays_couples.push(arr);
                }
            }
        }
        const final_set = new Set();
        for (var key of obj_array) {
            const dicts = new Object();
            var l = ((Object.values(key)));
            for (var x of arrays_couples) {
                if ((x[0][0]) == (l[0]) && (x[0][1]) == (l[1])) {
                    l[2] += 1;
                    dicts.ingr1 = l[0];
                    dicts.ingr2 = l[1];
                    dicts.value = l[2];
                    final_set.add(dicts);
                }
            }
        }
        const final_dict = Array.from(final_set);
        var ingredients_array = new Set();
        for (var x of final_dict) {
            ingredients_array.add(x.ingr1);
            ingredients_array.add(x.ingr2);
        }
        ingr_1_list = new Array();
        ingr_2_list = new Array();
        for (var i of ingredients_array) {
            ingr_1_dict = new Object();
            ingr_2_dict = new Object();
            ingr_1_dict.ingr1 = i;
            ingr_2_dict.ingr2 = i;
            ingr_1_list.push(ingr_1_dict);
            ingr_2_list.push(ingr_2_dict);
        }
        console.log(final_dict);
        var data = final_dict;
        series.data.setAll(data);
        yAxis.data.setAll(ingr_1_list);
        xAxis.data.setAll(ingr_2_list);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
        chart.appear(1000, 100);



    });

});




