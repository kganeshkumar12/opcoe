<div class="dgrm-sidebar">
  <h2 class="dgrm-sidebar-title">
    Cloud Migration Repository
  </h2>
  <h2 class="dgrm-sidebar-subtitle">
    Architecture Diagrams and Assessments
  </h2>
  <hr />
  <div class="dgrm-sidebar-link-search">
    <input type="search" placeholder="Search">
    <label>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FF612B" d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5"></path></svg>
    </label>
  </div>
  <div class="dgrm-sidebar-link-title">
    All Apps
  </div>
  <a href="/documentsrepository/care-mount/" class="dgrm-sidebar-link">CareMount, PH-NY</a>
  <a href="/documentsrepository/adt-flow/" class="dgrm-sidebar-link">ADT Flow</a>
  <a href="#" class="dgrm-sidebar-link">OCN-NY Care</a>
  <a href="#" class="dgrm-sidebar-link">Management</a>
  <a href="#" class="dgrm-sidebar-link">Tri State RBE</a>
  <a href="#" class="dgrm-sidebar-link">Solutions</a>
  <a href="#" class="dgrm-sidebar-link">Crystal Run Health</a>
  <a href="#" class="dgrm-sidebar-link">PH-NY</a>
  <a href="#" class="dgrm-sidebar-link">Riverside (Optum Medical Care NJ)</a>
  <a href="#" class="dgrm-sidebar-link">Solutions</a>
  <div class="dgrm-sidebar-link-no-results">
    No results found
  </div>
</div>

<script>
  document.querySelector('.dgrm-sidebar-link-search input').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    let hasResults = false;
    document.querySelectorAll('.dgrm-sidebar-link').forEach(function(link) {
      if (link.textContent.toLowerCase().includes(filter)) {
        link.classList.remove('dgrm-sidebar-link-hidden');
        hasResults = true;
      } else {
        link.classList.add('dgrm-sidebar-link-hidden');
      }
    });
    if (!hasResults) {
      document.querySelector('.dgrm-sidebar-link-no-results').classList.add('dgrm-sidebar-link-no-results-show');
    } else {
      document.querySelector('.dgrm-sidebar-link-no-results').classList.remove('dgrm-sidebar-link-no-results-show');
    }
  });

  const currentPath = window.location.pathname;
  document.querySelectorAll('.dgrm-sidebar-link').forEach(function(link) {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
</script>
