module.exports = function (eleventyConfig) {
    // Copy the assets the pages need into the build output
    eleventyConfig.addPassthroughCopy({ "src/portfolio.css": "portfolio.css" });
    eleventyConfig.addPassthroughCopy({ "src/theme.js": "theme.js" });

    return {
        dir: {
            input: "src",
            output: "_site",
        },
    };
};