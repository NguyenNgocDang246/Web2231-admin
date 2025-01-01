const changeActive = () => {
    const pageLinks = document.querySelectorAll('.page-link');

    pageLinks.forEach(link => {
      link.parentElement.classList.remove('active');

      if (link.getAttribute('data-page') === currentPage.toString() && !link.parentElement.classList.contains('n-page') && !link.parentElement.classList.contains('p-page')) {
        link.parentElement.classList.add('active');
      }

      if (currentPage === 1 && link.parentElement.classList.contains('p-page')) {
        link.parentElement.classList.remove('enabled');
        link.parentElement.classList.add('disabled');
      }

      if (currentPage === totalPages && link.parentElement.classList.contains('n-page')) {
        link.parentElement.classList.remove('enabled');
        link.parentElement.classList.add('disabled');
      }

      if (currentPage !== 1 && link.parentElement.classList.contains('p-page')) {
        link.parentElement.classList.remove('disabled');
        link.parentElement.classList.add('enabled');
      }

      if (currentPage !== totalPages && link.parentElement.classList.contains('n-page')) {
        link.parentElement.classList.remove('disabled');
        link.parentElement.classList.add('enabled');
      }
    });
};