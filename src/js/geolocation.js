
const userGpsCoords= [{error: "none"},{}];
const responseArray = [];

function getGpsPermission()
{
    if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(position => {
                userGpsCoords[1] = position.coords;
                userGpsCoords[0].error = "none";
            });
        } else {
            userGpsCoords[0].error = "GPS_PERMISSION_DENIED";
        }
}

async function adressAPI()
{
    const response = await fetch(`/getDistance/${userGpsCoords[1].latitude}/${userGpsCoords[1].longitude}/${userGpsCoords[1].accuracy}`,{
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET"
    }).then(response => {
        return response.json();
    }).then(responseJson => {
        return responseJson;
    });
    return response;
}

getGpsPermission();
document.querySelector("#btn-loc").addEventListener("click", async () => {
    if(userGpsCoords[0].error == "none")
    {
        let data = await adressAPI();
        console.log(responseArray.length, data.lower_distance_coords.latitude);
    }
    else {
        alert(userGpsCoords[0].error);
    }
});