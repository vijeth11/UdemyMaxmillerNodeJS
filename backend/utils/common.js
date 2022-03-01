
exports.getDataFromCookie = (req, key ) => {
    let cookieData = null;
    if(req.get('Cookie')){
         cookieData = req.get('Cookie').split(';').filter(x => x.indexOf(key) > -1)
    }
    if(cookieData && cookieData.length > 0){
        return cookieData[0].trim().split('=')[1];
    }
    return undefined;
}