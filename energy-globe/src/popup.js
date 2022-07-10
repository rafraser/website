import mapboxgl from "mapbox-gl";

export function buildPopup(feature) {
    const coordinates = feature.geometry.coordinates.slice();
    const properties = feature.properties;

    // Build the contents
    const container = document.createElement('div');
    const title = document.createElement('h3');
    title.innerText = feature.properties.name.toUpperCase();
    container.appendChild(title);

    const table = document.createElement('table');
    createTableRow(table, 'Primary Fuel', properties.primary_fuel);
    createTableRow(table, 'Capacity', properties.capacity_mw + 'MW');
    createTableRow(table, 'Commissioning Year', properties.commissioning_year || 'Unknown');
    container.appendChild(table);

    const popup = new mapboxgl.Popup()
    popup.setLngLat(coordinates);
    popup.setHTML(container.outerHTML);
    return popup;
}

function createTableRow(table, label, value) {
    const row = document.createElement('tr');
    const leftCell = document.createElement('td');
    leftCell.style.fontWeight = 'bold';
    leftCell.innerText = label;
    row.appendChild(leftCell);

    const rightCell = document.createElement('td');
    rightCell.innerText = value;
    row.appendChild(rightCell);
    table.appendChild(row);
}