(async function() {
    const dataResponse = await fetch('http://localhost:8000/data.json');
    const data = await dataResponse.json();
    const app = document.getElementById('app');
    const activeFilter = document.getElementById('active-filter');
    const activeFilterValue = activeFilter.value;
    const rootNodes = data.filter((node) => node.parentId === 0);

    const setFilterClassName = (filterValue) => {
        app.classList.toggle('show-active', filterValue === 'true');
        app.classList.toggle('show-not-active', filterValue === 'false');
    };

    const createEl = (tagName) => {
        return document.createElement(tagName);
    };

    const toggleChildren = (parentId, isOpen) => {
        const childNodes = document.getElementsByClassName(`parent-${parentId}`);
        const isTrueFilter = app.classList.contains('show-active');
        const isFalseFilter = app.classList.contains('show-not-active');

        for (let i = 0; i < childNodes.length; i++) {
            const child = childNodes[i];

            child.style.display = isOpen ? 'table-row' : 'none';
        }
    };

    const buildTable = () => {
        const table = createEl('table');
        const headerValues = Object.keys(data[0]);

        const tableHeader = buildRow('th', headerValues);

        table.appendChild(tableHeader);

        const tbody = createEl('tbody');

        rootNodes.forEach((node) => {
            const childNodes = data.filter((child) => child.parentId === node.id);
            let toggleBtn = null;

            if (childNodes.length) {
                toggleBtn = createEl('button');
                toggleBtn.innerText = '+';

                toggleBtn.onclick = () => {
                    toggleBtn.classList.toggle('is-open');

                    const rowIsOpen = toggleBtn.classList.contains('is-open');

                    toggleBtn.innerText = rowIsOpen ? '-' : '+';

                    toggleChildren(node.id, rowIsOpen);
                };
            }

            const row = buildRow('td', Object.values(node), toggleBtn);
            row.classList.add(node.isActive ? 'is-active' : 'not-active');

            tbody.appendChild(row);

            childNodes.forEach((child) => {
                const childRow = buildRow('td', Object.values(child));

                childRow.classList.add('child', `parent-${child.parentId}`);

                tbody.appendChild(childRow);
            });
        });

        table.appendChild(tbody);

        app.appendChild(table);
        setFilterClassName(activeFilterValue);
    };

    const buildRow = (tagName, values, toggleBtn = null) => {
        const row = createEl('tr');

        if (toggleBtn) {
            const td = createEl(tagName);

            td.appendChild(toggleBtn);
            row.appendChild(td);
        } else {
            const td = createEl(tagName);

            td.innerText = tagName === 'th' ? 'Toggle' : '';
            row.appendChild(td);
        }

        for (let value of values) {
            const td = createEl(tagName);

            td.innerText = value;
            row.appendChild(td);
        }

        return row;
    };

    activeFilter.onchange = (event) => {
        setFilterClassName(event.currentTarget.value);
    };

    buildTable();
})();
