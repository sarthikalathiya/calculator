document.querySelector('.theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

document.getElementById('trigToggle').addEventListener('click', function() {
    document.getElementById('trigDropdown').classList.toggle('show');
    document.querySelector('#trigToggle .fa-chevron-down').classList.toggle('rotate-arrow');
});