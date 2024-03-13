const config = require('../../config.json');
/**
 * Props item - Houses all the navbar items and submenu items
 */
const props = [
    <% if (path == 'GettingStartedLink/') { %>
    {
       name: 'help', //Used in css and js reference
       labelText: {
           en: 'Getting Started &amp; Help'
        }, // Displayed to user
       hasSubmenu: true, // Used to build the nav tree
       submenuItems: [
            {
                name: '<%= root %>',
                labelText: config.items[0].menuName,
            }
        ]
    },
    <% } %>
    <% if (path == 'ActivityLink/') { %>
     {
         name: 'activity',
         labelText: {
             en: 'Activity'
            },
         hasSubmenu: true,
         submenuItems: [
                {
                    name: '<%= root %>',
                    labelText: config.items[0].menuName,
                }
            ]
    },
    <% } %>
    <% if (path == 'EngineMaintenanceLink/') { %>
    {
        name: 'engine',
        labelText: {
            en:'Engine &amp; Maintenance'
        },
        hasSubmenu: true,
        submenuItems: [
                {
                    name: '<%= root %>',
                    labelText:config.items[0].menuName,
                }
            ]
        },
        <% } %>
    <% if (path == 'ZoneAndMessagesLink/') { %>
     {
         name: 'zone',
         labelText: {
             en: 'Zones &amp; Messages'
            },
         hasSubmenu: true,
         submenuItems: [
                {
                    name: '<%= root %>',
                    labelText: config.items[0].menuName,
                }
            ]
        },
    <% } %>
    <% if (path == 'RuleAndGroupsLink/') { %>
     {
        name: 'rule',
        labelText: {
            en: 'Rules &amp; Groups'
        },
        hasSubmenu: true,
        submenuItems: [
            {
                name: '<%= root %>',
                labelText: config.items[0].menuName,
            }
        ]
    },
    <% } %>
    <% if (path == 'AdministrationLink/') { %>
     {
        name: 'administration',
        labelText: {
            en: 'Administration'
        },
        hasSubmenu: true,
        submenuItems: [
                {
                    name: '<%= root %>',
                    labelText: config.items[0].menuName,
                }
            ]
        },
    <% } %>
     <% if (path == ''){ %>
     {
        name: '<%= root %>',
        labelText: config.items[0].menuName,
        hasSubmenu: false,
        submenuItems: []
     }
     <% } %>
];

module.exports = props;