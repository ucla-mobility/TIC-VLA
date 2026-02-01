// ===== Mini-chart formatter (optional helper) =====
var chartFormatter = function (cell, formatterParams, onRendered) {
    var content = document.createElement("span");
    var values = cell.getValue();

    // invert values if needed
    if (formatterParams && formatterParams.invert) {
        values = values.map(val => val * -1);
    }

    // add values to chart and style
    content.classList.add(formatterParams?.type || "line");
    // peity expects CSV text content
    content.textContent = values.join(",");

    // setup chart options
    var options = {
        width: 50,
        // min: 0.0,
        // max: 100.0,
    };
    if (formatterParams && formatterParams.fill) {
        options.fill = formatterParams.fill;
    }

    // instantiate peity chart after the cell element has been added to the DOM
    onRendered(function () {
        try {
            // If using jQuery peity, you likely need: $(content).peity(formatterParams.type, options)
            peity(content, formatterParams?.type || "line", options);
        } catch (e) {
            // swallow if peity isn't available; table still renders
            console.warn("Peity not available:", e);
        }
    });

    return content;
};

// ===== Shared gradient cell formatters =====
function makeColorFormatter(defaultEndColor) {
    return function (cell, formatterParams) {
        var value = cell.getValue();

        // Pass-through for explicit "-"
        if (value === "-") return value;

        // Defaults
        var defaults = {
            min: 0.0,
            max: 100.0,
            startColor: { r: 255, g: 255, b: 255 },
            endColor: defaultEndColor
        };

        // Override with provided params
        var min = (formatterParams && formatterParams.min) ?? defaults.min;
        var max = (formatterParams && formatterParams.max) ?? defaults.max;
        var startColor = (formatterParams && formatterParams.startColor) || defaults.startColor;
        var endColor = (formatterParams && formatterParams.endColor) || defaults.endColor;

        // Clamp then normalize to [0,1]
        var num = Number(value);
        if (Number.isNaN(num)) return value;
        num = Math.max(min, Math.min(max, num));
        var normalized = (num - min) / Math.max(1e-9, (max - min));

        // Interpolate color
        var red   = Math.floor(startColor.r + (endColor.r - startColor.r) * normalized);
        var green = Math.floor(startColor.g + (endColor.g - startColor.g) * normalized);
        var blue  = Math.floor(startColor.b + (endColor.b - startColor.b) * normalized);

        // Round to 1 decimal place for display
        var shown = num.toFixed(1);

        return "<span style='display:block;width:100%;height:100%;font-size:1.0em;background-color:rgb(" +
               red + "," + green + "," + blue + ");'>" + shown + "</span>";
    };
}

var colorFormatterGoalInt  = makeColorFormatter({ r: 238, g: 211, b: 217 }); // pinkish
var colorFormatterSubgoal  = makeColorFormatter({ r: 245, g: 232, b: 221 }); // beige
var colorFormatterActionSeq= makeColorFormatter({ r: 204, g: 211, b: 202 }); // green-gray
var colorFormatterTrans    = makeColorFormatter({ r: 181, g: 192, b: 208 }); // blue-gray

// ===== Progress bar color function (used by Tabulator "progress" formatter) =====
var barColorFn = function (value, formatterParams) {
    var defaults = {
        range: [-50, 50],
        low:  { r: 255, g: 255, b: 255 },
        high: { r: 206, g: 212, b: 218 }
    };

    // Safely read custom params
    var p = formatterParams || {};
    var low_range  = (p.range && typeof p.range[0] === "number") ? p.range[0] : defaults.range[0];
    var high_range = (p.range && typeof p.range[1] === "number") ? p.range[1] : defaults.range[1];
    var low  = p.low  || defaults.low;
    var high = p.high || defaults.high;

    // Clamp
    var v = Math.max(low_range, Math.min(high_range, Number(value)));
    var range = Math.max(1e-9, (high_range - low_range));

    // Correct normalization across arbitrary ranges
    var t = (v - low_range) / range;

    var r = Math.floor(low.r  + (high.r  - low.r)  * t);
    var g = Math.floor(low.g  + (high.g  - low.g)  * t);
    var b = Math.floor(low.b  + (high.b  - low.b)  * t);

    return 'rgba(' + r + ',' + g + ',' + b + ',0.9)';
};

// ===== Page init: only EB-Manipulation =====
document.addEventListener('DOMContentLoaded', function () {
    fetch('website/data/eb_manipulation_total_benchmark.json')
        .then(response => response.json())
        .then((eb_manipulation_total_benchmark_data) => {
            var getColumnMinMax = (data, field) => {
                let values = data
                    .map(item => item[field])
                    .filter(val => val !== "-" && val !== null && val !== undefined && !Number.isNaN(Number(val)))
                    .map(Number);
                if (!values.length) return { min: 0, max: 100 };
                return { min: Math.min(...values), max: Math.max(...values) };
            };

            var eb_manipulation_columns = [
                {
                    title: "Model",
                    field: "model",
                    cssClass: "avg-column",
                    widthGrow: 1.5,
                    minWidth: 180,
                    headerSort: true
                },
                {
                    title: "Avg<br>Perf.",
                    field: "eb_mani_avg",
                    cssClass: "avg-column",
                    formatter: "progress",
                    minWidth: 90,
                    formatterParams: {
                        min: 0,               // use 0–100 for consistency
                        max: 100,
                        legend: true,
                        color: barColorFn,
                    },
                    sorter: "number"
                },
                {
                    title: "Base",
                    field: "eb_mani_base",
                    cssClass: "avg-column",
                    hozAlign: "center",
                    minWidth: 100,
                    headerSort: true,
                    formatter: colorFormatterSubgoal
                },
                {
                    title: "Common",
                    field: "eb_mani_common",
                    cssClass: "avg-column",
                    hozAlign: "center",
                    minWidth: 100,
                    headerSort: true,
                    formatter: colorFormatterActionSeq
                },
                {
                    title: "Complex",
                    field: "eb_mani_complex",
                    cssClass: "avg-column",
                    hozAlign: "center",
                    minWidth: 100,
                    headerSort: true,
                    formatter: colorFormatterTrans
                },
                {
                    title: "Visual",
                    field: "eb_mani_visual",
                    cssClass: "avg-column",
                    hozAlign: "center",
                    minWidth: 100,
                    headerSort: true,
                    formatter: colorFormatterGoalInt
                },
                {
                    title: "Spatial",
                    field: "eb_mani_spatial",
                    cssClass: "avg-column",
                    hozAlign: "center",
                    minWidth: 100,
                    headerSort: true,
                    formatter: colorFormatterSubgoal
                },
            ];

            // Inject per-column min/max for smooth gradients
            eb_manipulation_columns.forEach(column => {
                if (column.field && column.field !== "eb_mani_avg") {
                    let { min, max } = getColumnMinMax(eb_manipulation_total_benchmark_data, column.field);
                    column.formatterParams = Object.assign({ min, max }, column.formatterParams || {});
                }
            });

            // Build the table
            var eb_manipulation_table = new Tabulator("#eb-manipulation-benchmark-main-table", {
                data: eb_manipulation_total_benchmark_data,
                layout: "fitColumns",
                responsiveLayout: "collapse",
                responsiveLayoutCollapseStartOpen: false,
                movableColumns: false,
                initialSort: [{ column: "eb_mani_avg", dir: "desc" }],
                columnDefaults: { tooltip: true },
                columns: eb_manipulation_columns
            });
        });
});
