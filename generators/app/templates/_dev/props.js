/**
 * Props item - Houses all the navbar items and submenu items
 */
const props = [
    <% if (path == "GettingStartedLink/") { %>
    {
       name: "help", //Used in css and js reference
       labelText: "Getting Started &amp; Help", // Displayed to user
       hasSubmenu: true, // Used to build the nav tree
       submenuItems: [
           {
               name: "guide",
               labelText: "Product Guide"
           },
           {
               name: "mainMenuForum",
               labelText: "Geotab Community"
           },
            {
                name: "<%= root %>",
                labelText: "<%= label %>"
            }
        ]
    },
    <% } %>
    // {
    //     name: "map",
    //     labelText: "Map",
    //     hasSubmenu: false,
    //     submenuItems: []
    // },
    // {
    //     name: "vehicle",
    //     labelText: "Vehicles",
    //     hasSubmenu: false,
    //     submenuItems: []
    // },
    <% if (path == "ActivityLink/") { %>
     {
         name: "activity",
         labelText: "Activity",
         hasSubmenu: true,
         submenuItems: [
            //  {
            //      name: "mainMenuRisk",
            //      labelText: "Risk Management"
            //  },
            //  {
            //      name:"collision",
            //      labelText: "Collision Reconstruction"
            //  },
                {
                    name: "<%= root %>",
                    labelText: "<%= label %>"
                }
            ]
    },
    <% } %>
    <% if (path == "EngineMaintenanceLink/") { %>
    {
        name: "engine",
        labelText: "Engine &amp; Maintenance",
        hasSubmenu: true,
        submenuItems: [
            // {
            //     name: "mainMenuTrends",
            //     labelText: "Fuel and EV Energy Usage"
            // },
                {
                    name: "<%= root %>",
                    labelText: "<%= label %>"
                }
            ]
        },
        <% } %>
    <% if (path == "ZoneAndMessagesLink/") { %>
     {
         name: "zone",
         labelText: "Zones &amp; Messages",
         hasSubmenu: true,
         submenuItems: [
            //  {
            //      name: "zone",
            //      labelText: "Zones"
            //  },
            //  {
            //      name: "zoneImport",
            //      labelText: "Import Zones"
            //  },
            //  {
            //      name: "mainMenuGpsMessage",
            //      labelText: "Messages"
            //  },
                {
                    name: "<%= root %>",
                    labelText: "<%= label %>"
                }
            ]
        },
    <% } %>
    <% if (path == "RuleAndGroupsLink/") { %>
     {
        name: "rule",
        labelText: "Rules &amp; Groups",
        hasSubmenu: true,
        submenuItems: [
            // {
            //     name: "rules",
            //     labelText: "Rules"
            // },
            // {
            //     name: "rule",
            //     labelText: "Exceptions"
            // },
            // {
            //     name: "mainMenuGroup",
            //     labelText: "Groups"
            // },
            {
                name: "<%= root %>",
                labelText: "<%= label %>"
            }
        ]
    },
    <% } %>
    <% if (path == "AdministrationLink/") { %>
     {
        name: "administration",
        labelText: "Administration",
        hasSubmenu: true,
        submenuItems: [
            // {
            //     name: "users",
            //     labelText: "Users"
            // },
                {
                    name: "<%= root %>",
                    labelText: "<%= label %>"
                }
            ]
        },
    <% } %>
     <% if (path == ""){ %>
     {
        name: "<%= root %>",
        labelText: "<%= label %>",
        hasSubmenu: false,
        submenuItems: []
     }
     <% } %>
];