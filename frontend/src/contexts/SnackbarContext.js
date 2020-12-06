import React from "react"

const SnackbarContext = React.createContext({
    snackbar: undefined,
    setSnackbar: () => {}
});

export default SnackbarContext;