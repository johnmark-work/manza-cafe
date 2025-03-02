function showCategory(category, element) {
    // Hide all food categories
    document.querySelectorAll('.food-grid').forEach(grid => grid.classList.add('hidden'));
    
    // Show the selected category
    document.getElementById(category).classList.remove('hidden');

    // Remove highlight from all tabs
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.classList.remove("border-4", "border-black", "shadow-lg", "scale-110", "transition", "duration-200");
    });

    // Add highlight to active tab
    element.classList.add("border-4", "border-black", "shadow-lg", "scale-110", "transition", "duration-200");
}


// Highlight the default tab (Iced Coffee) on page load
document.addEventListener("DOMContentLoaded", function() {
    let defaultTab = document.getElementById("tab-iced-coffee");
    showCategory('iced-coffee', defaultTab);
});

// sticky top aside
window.addEventListener("scroll", function () {
    let aside = document.getElementById("stickyAside");
    let scrollY = window.scrollY;

    if (scrollY > 100) { // Adjust threshold if needed
        aside.style.position = "fixed";
        aside.style.top = "0px";
        aside.style.left = "0px"; 
        aside.style.zIndex = "1000"; // Keep above content
    } else {
        aside.style.position = "absolute"; // Reset to normal position
        aside.style.top = "0px";
    }
});