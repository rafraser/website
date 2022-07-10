export const legendColors = {
    'Coal': '#ff7f00',
    'Gas': '#fdbf6f',
    'Hydro': '#e31a1c',
    'Nuclear': '#fb9a99',
    'Oil': '#33a02c',
    'Solar': '#b2df8a',
    'Wind': '#1f78b4',
    'Other': '#a6cee3'
}

export function createLegend() {
    const container = document.getElementById('legend');

    Object.entries(legendColors).forEach(([key, value]) => {
        const div = document.createElement('div');

        const bubble = document.createElement('div');
        bubble.className = 'legend-bubble';
        bubble.style.backgroundColor = value;
        div.appendChild(bubble);

        const t = document.createTextNode(key);
        div.appendChild(t);

        container.appendChild(div);
    })
}