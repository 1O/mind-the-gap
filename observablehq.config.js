// See https://observablehq.com/framework/config for documentation.

const impressum = `
  <div class="grid grid-cols-4" style="grid-template-columns: 1fr 1fr 1fr">
    <div>This tool gives access to the results of the analysis of transnational policy gaps related to the climate risk management of weather extremes
      conducted in the X-RISK-CC project.
    </div>
    <div>Analysis of policy gaps conducted, and contents compiled by: <a href="https://www.umweltbundesamt.at/en/">Environment Agency Austria</a>. Built with Observable by <a href="https://orcid.org/0000-0001-5793-6641">I. Offenthaler</a></div>
    <div>The <a href="www.alpine-space.eu/project/x-risk-cc/">X-RISK-CC project</a> is co-funded by the European Union through the Interreg Alpine Space programme.</div>
  </div>
`
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Mind the gap",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: '<h1>Policy gap explorer</h1>', // what to show in the header (HTML)
   //footer: '<div class="grid grid-cols-4" style="grid-template-columns: 1fr 1fr 1fr 1fr"></div>'
  
   footer: impressum,
   sidebar: false, // whether to show the sidebar
   toc: false, // whether to show the table of contents
   pager: false, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  preserveExtension: true, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};
