
function onError(msg) {
    if (confirm(msg)) {
        window.location.reload();
    }
}
