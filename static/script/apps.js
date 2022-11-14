async function apps(app) {
    app.search.pd_round.input.placeholder = 'Search apps'
    app.search.back.style.display = 'inline';
    app.search.pd_round.sep.style.display = 'none';
    app.search.back.href = '#';

    app.main.library = app.createElement('div', await compileGs(app), {
        class: 'gs-library',
        style: {}
    });
    app.main.emptySearch = app.createElement('div', [
        app.createElement('p', 'No results found.'),
    ], {
        class: 'gs-empty',
        style: {
            display: 'none'
        }
    });

    app.search.pd_round.input.setAttribute(
        'oninput',
        '(' + (function () {
            let count = 0;

            app.main.library.querySelectorAll('.gs-entry').forEach(node => {
                if (node.getAttribute('data-title').toLowerCase().includes(app.search.pd_round.input.value.toLowerCase())) {
                    node.setAttribute('data-active', '1');
                    count++;
                } else {
                    node.removeAttribute('data-active');
                };
            });

            if (!count) {
                app.main.library.style.display = 'none';
                app.main.emptySearch.style.display = 'block';
            } else {
                app.main.library.style.removeProperty('display');
                app.main.emptySearch.style.display = 'none';
            };
        }).toString() + ')()'
    )
};


async function compileGs(app) {
    const res = await fetch('./apps.json');
    const json = await res.json();
    const arr = [];

    for (const entry of json) {
        arr.push(
            app.createElement('div', [], {
                class: 'gs-entry',
                style: {
                    background: `url(${entry.img})`,
                    'background-size': 'cover'
                },
                attrs: {
                    'data-title': entry.title,
                    'data-active': ''
                },
                events: {
                    click(event) {
                        const frame = document.querySelector('iframe');
                        document.querySelector('main').style.display = 'none';
                        document.querySelector('header').style.display = 'none';
                        frame.style.display = 'block';
                        frame.src = (entry.location.startsWith('https://') || entry.location.startsWith('http://')) ? './load.html#' + encodeURIComponent(btoa(entry.location))
                            : entry.location;

                        document.querySelector('.access-panel').style.removeProperty('display');
                    }
                }
            })
        )
    };

    return arr;
};

export { apps };
