// -----------  -------------

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
// ----------- COUNTER -------------

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


am5.ready(function () {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
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
            valueField: "value"
        })
    );

    series.columns.template.setAll({
        forceHidden: true
    });

    var circleTemplate = am5.Template.new({ radius: 5 });


    // Add circle bullet
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
    series.bullets.push(function () {
        var graphics = am5.Circle.new(
            root, {
            stroke: series.set("stroke", am5.color("#c6596e")),
            fill: series.set("fill", am5.color("#c6596e"))
        }, circleTemplate
        );
        return am5.Bullet.new(root, {
            sprite: graphics
        });
    });


    // Set up heat rules
    // https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/
    series.set("heatRules", [{
        target: circleTemplate,
        min: 5,
        max: 35,
        dataField: "value",
        key: "radius"
    }]);


    // Set data
    // https://www.amcharts.com/docs/v5/charts/xy-chart/#Setting_data

    var data = [{

        ingr1: "vegetables",
        ingr2: "vegetables",
        value: 10
    }, {
        ingr1: "vegetables",
        ingr2: "meat",
        value: 8
    }, {
        ingr1: "vegetables",
        ingr2: "spice",
        value: 3
    }, {
        ingr1: "vegetables",
        ingr2: "fish",
        value: 3
    }, {
        ingr1: "vegetables",
        ingr2: "rice",
        value: 7
    }, {
        ingr1: "legumes",
        ingr2: "legumes",
        value: 9
    }, {
        ingr1: "legumes",
        ingr2: "vegetables",
        value: 6
    }, {
        ingr1: "legumes",
        ingr2: "meat",
        value: 2
    }, {
        ingr1: "legumes",
        ingr2: "spice",
        value: 4
    }, {
        ingr1: "legumes",
        ingr2: "fish",
        value: 1
    }, {
        ingr1: "legumes",
        ingr2: "rice",
        value: 2
    },
    {
        ingr1: "meat",
        ingr2: "meat",
        value: 10
    },
    {
        ingr1: "meat",
        ingr2: "spice",
        value: 4
    },
    {
        ingr1: "meat",
        ingr2: "fish",
        value: 3
    },
    {
        ingr1: "meat",
        ingr2: "rice",
        value: 3
    },
    {
        ingr1: "rice",
        ingr2: "rice",
        value: 10
    },
    {
        ingr1: "spice",
        ingr2: "spice",
        value: 10
    },
    {
        ingr1: "spice",
        ingr2: "fish",
        value: 8
    },
    {
        ingr1: "spice",
        ingr2: "rice",
        value: 7
    },
    {
        ingr1: "fish",
        ingr2: "fish",
        value: 10
    },
    {
        ingr1: "fish",
        ingr2: "rice",
        value: 0
    }];

    series.data.setAll(data);


    yAxis.data.setAll([
        { ingr1: "legumes" },
        { ingr1: "vegetables" },
        { ingr1: "meat" },
        { ingr1: "spice" },
        { ingr1: "fish" },
        { ingr1: "rice" }
    ]);

    xAxis.data.setAll([
        { ingr2: "vegetables" },
        { ingr2: "legumes" },
        { ingr2: "meat" },
        { ingr2: "spice" },
        { ingr2: "fish" },
        { ingr2: "rice" }
    ]);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
    chart.appear(1000, 100);

    setInterval(function () {
        var i = 0;
        series.data.each(function (d) {
            var n = {
                value: d.value + d.value * Math.random() * 0.5,
                ingr1: d.ingr1,
                ingr2: d.ingr2
            };
            series.data.setIndex(i, n);
            i++;
        });
    }, 1000);

});

am5.ready(function () {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv_pie");
    var myTheme = am5.Theme.new(root);
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
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
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/
    var chart = root.container.children.push(am5percent.SlicedChart.new(root, {
        layout: root.verticalLayout
    }));
    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/#Series
    var series = chart.series.push(am5percent.PictorialStackedSeries.new(root, {
        alignLabels: true,
        orientation: "vertical",
        valueField: "value",
        categoryField: "category",
        svgPath: "M629.43,291c-23,.9-49.8,3.5-53.5,5.2-3.3,1.6-3.9,6.9-1.2,10.7a23.72,23.72,0,0,1,3.1,6.6c.6,2.1,4,33.6,7.6,69.9s7.1,67.7,7.7,69.8c1.4,4.8,7,11.2,11.8,13.7,20.8,10.6,75.7,12.2,104,3.1,17-5.5,21.2-10.3,23-26.1,1.1-10,8.6-94.6,9.7-108.8.4-5.1,1.2-8.9,2-9.8,1.9-1.9,26.6-2,28-.2.6.7,1.8,9.2,2.8,18.8,4.5,45.4,7.3,66.7,9,69.4,1.9,2.9,6.3,5.6,9.1,5.6,1.5,0,1.6-1.3,1.1-14.3-.4-7.8-1.4-31.1-2.3-51.7s-1.8-38.5-2-39.8c-.7-3.7-11.4-7.2-28.7-9.3-7.7-.9-8.4-1.2-11.3-4.6-4.2-4.9-9.9-5.9-44.9-7.8C674.73,289.81,661.43,289.71,629.43,291Z"
    }));
    series.labelsContainer.set("width", 100);
    series.ticks.template.set("location", 0.6);
    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/#Setting_data
    series.data.setAll([
        { value: 10, category: "as you like" },
        { value: 9, category: "gr" },
        { value: 6, category: "sprinle" },
        { value: 5, category: "lt" },
        { value: 4, category: "knob" },
        { value: 3, category: "kg" },
        { value: 1, category: "handful" }
    ]);
    // Play initial series animation
    // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
    chart.appear(1000, 100);
}); // end am5.ready()





am5.ready(function () {

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv_ingredients");
    var myTheme = am5.Theme.new(root);
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
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

    series.data.setAll([{
        name: "ingredients",
        children: [
            {
                name: "vegetables",
                children: [
                    { name: "tomato", value: 5 },
                    { name: "olive", value: 1 },
                    { name: "cabbage", value: 3 },
                    { name: "onion", value: 8 },
                    { name: "carrot", value: 10 },
                    { name: "celery", value: 3 }


                ]
            },
            {
                name: "meat",
                children: [
                    { name: "crest", value: 2 },
                    { name: "capon", value: 1 },
                    { name: "marrow", value: 4 },
                    { name: "beef", value: 8 },
                    { name: "chicken", value: 9 }
                ]
            },
            {
                name: "fish",
                children: [
                    { name: "anchovy", value: 1 },
                    { name: "cuttlefish", value: 2 },
                    { name: "shrimp", value: 5 }
                ]
            },
            {
                name: "spices",
                children: [
                    { name: "pepper", value: 10 },
                    { name: "nutmeg", value: 9 },
                    { name: "cinnamon", value: 5 },
                    { name: "saffron", value: 2 }
                ]
            },
            {
                name: "fruits",
                children: [
                    { name: "raisin", value: 5 },
                    { name: "apricot", value: 1 },
                    { name: "almond", value: 5 },
                    { name: "pear", value: 2 },
                    { name: "orange", value: 2 }
                ]
            },
            {
                name: "diary",
                children: [
                    { name: "milk", value: 5 },
                    { name: "parmesan", value: 1 },
                    { name: "gruyere", value: 5 },
                    { name: "ricotta", value: 2 },
                    { name: "mozzarella", value: 2 },
                    { name: "cream", value: 2 },
                    { name: "mascarpone", value: 2 }

                ]
            },
            {
                name: "herb",
                children: [
                    { name: "parsley", value: 5 },
                    { name: "clove", value: 1 },
                    { name: "laurel", value: 5 }

                ]
            }]
    }]);
    series.set("selectedDataItem", series.dataItems[0]);
    chart.appear(1000, 100);
}); // end am5.ready()

