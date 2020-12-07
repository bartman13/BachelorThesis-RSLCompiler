function authHeader(user){
    return {
        headers: { Authorization: 'Bearer ' + user.token }
    };
}

export default authHeader;