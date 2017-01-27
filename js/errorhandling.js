function handleError(msg) {
    if (confirm(msg)) {
        window.location.reload();
    }
}
