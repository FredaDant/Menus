$(function() {
    $('select[name="menuDate"]').change(function() {
        var $this = $(this);
        console.log($this.val());
    });
});