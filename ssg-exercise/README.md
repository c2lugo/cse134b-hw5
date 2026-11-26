# HW5 Part 4: Eleventy Shared Footer Exercise

Two pages from my portfolio, **Home** and **Projects**, rebuilt with [Eleventy](https://www.11ty.dev/).
Both pages use one shared footer, written once in `src/_includes/footer.njk`.

## Structure

```
ssg-exercise/
    eleventy.config.js        input: src, output: _site, passthrough copy for CSS/JS
    package.json              build and start scripts
    src/
        _includes/
            footer.njk        shared footer
        index.njk             Home page
        projects.njk          Projects page (front matter: permalink: projects.html)
        portfolio.css         copied to the build output
        theme.js              copied to the build output
```

Each page includes the footer with:

```
{% include "footer.njk" %}
```

## Commands

Run from inside `ssg-exercise/`:

```
npm install       # install dependencies
npm run build     # build the site into _site/
npm run start     # build, watch for changes, and preview at http://localhost:8080
```

## Pages to preview

- Home: http://localhost:8080/
- Projects: http://localhost:8080/projects.html

Nav links to other portfolio pages (Resume, Experiments, Contact) are not part of this
exercise and will 404 in the preview.

## Verifying the shared section

1. Run `npm run start`.
2. Edit the text in `src/_includes/footer.njk` and save.
3. Refresh both pages. Both show the updated footer.

The original Projects page had no footer. It gets one now only through the shared include.