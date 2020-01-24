/**
 * Props item - Houses all the navbar items and submenu items
 */
const props = [
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
           <% if (path == "GettingStartedLink/") { %>
            {
                name: "<%= root %>",
                labelText: "<%= label %>"
            }
            <% } %>
       ]
    },
    {
        name: "map",
        labelText: "Map",
        hasSubmenu: false,
        submenuItems: []
     },
     {
         name: "vehicle",
         labelText: "Vehicles",
         hasSubmenu: false,
         submenuItems: []
     },
     {
         name: "activity",
         labelText: "Activity",
         hasSubmenu: true,
         submenuItems: [
             {
                 name: "mainMenuRisk",
                 labelText: "Risk Management"
             },
             {
                 name:"collision",
                 labelText: "Collision Reconstruction"
             },<% if (path == "ActivityLink/") { %>
                {
                    name: "<%= root %>",
                    labelText: "<%= label %>"
                }<% } %>
         ]
     },
     {
        name: "engine",
        labelText: "Engine &amp; Maintenance",
        hasSubmenu: true,
        submenuItems: [
            {
                name: "mainMenuTrends",
                labelText: "Fuel and EV Energy Usage"
            },
            <% if (path == "EngineMaintenanceLink/") { %>
                {
                    name: "<%= root %>",
                    labelText: "<%= label %>"
                }
            <% } %>
        ]
     },
     {
         name: "zone",
         labelText: "Zones &amp; Messages",
         hasSubmenu: true,
         submenuItems: [
             {
                 name: "zone",
                 labelText: "Zones"
             },
             {
                 name: "zoneImport",
                 labelText: "Import Zones"
             },
             {
                 name: "mainMenuGpsMessage",
                 labelText: "Messages"
             },<% if (path == "ZoneAndMessagesLink/") { %>
                {
                    name: "<%= root %>",
                    labelText: "<%= label %>"
                }<% } %>
         ]
     },
     {
        name: "rule",
        labelText: "Rules &amp; Groups",
        hasSubmenu: true,
        submenuItems: [
            {
                name: "rules",
                labelText: "Rules"
            },
            {
                name: "rule",
                labelText: "Exceptions"
            },
            {
                name: "mainMenuGroup",
                labelText: "Groups"
            },<% if (path == "RuleAndGroupsLink/") { %>
            {
                name: "<%= root %>",
                labelText: "<%= label %>"
            }<% } %>
        ]
     },
     {
        name: "administration",
        labelText: "Administration",
        hasSubmenu: true,
        submenuItems: [
            {
                name: "users",
                labelText: "Users"
            },
            <% if (path == "AdministrationLink/") { %>
                {
                    name: "<%= root %>",
                    labelText: "<%= label %>"
                }
            <% } %>
        ]
     },
     <% if (path == ""){ %>
     {
        name: "<%= root %>",
        labelText: "<%= label %>",
        hasSubmenu: false,
        submenuItems: []
     }<% } %>
];