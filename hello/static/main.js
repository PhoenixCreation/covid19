var statedata=[]
var ll=[]
var url = "https://api.covid19india.org/v2/state_district_wise.json"




var mymap = L.map('mapid').setView([23.02579, 80], 5) //creates leaflet interaction for maps

//add map tiles to the leaflet model
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGVhbXNpdGFyZSIsImEiOiJjazlsZmtkbmUwNzBvM2VwZDlvdWpvN3p1In0.7NPffWm3ggbnaQkaMfajBw', {
  maxZoom: 30,
  attribution: '',
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);

csvdata = "/static/latlon.json"
fetch(csvdata)
.then(res => res.json())
.then((info) => {
  ll=info;

  //fetch the data from https://api.covid19india.org/
  fetch(url)
  .then(res => res.json())
  .then((info) => {
    for(var i=1;i<info.length;i++){ //i=1 because the data has prorotype at first index
      statedata[i-1]=info[i]
      // go through all the districts of state...
      console.log(statedata[i-1].state);
      for(var x=1;x<statedata[i-1].districtData.length;x++){ //x=1 because the data has not useful information at first index
        var name = statedata[i-1].districtData[x].district;
        var total = statedata[i-1].districtData[x].confirmed;
        var active = statedata[i-1].districtData[x].active;
        var recover = statedata[i-1].districtData[x].recovered;
        var death = statedata[i-1].districtData[x].deceased;
        var lat,lan;
        for(var y=0;y<ll[statedata[i-1].state].length;y++){
          if(name == ll[statedata[i-1].state][y].District){
            lat=ll[statedata[i-1].state][y].Latitude;
            lan=ll[statedata[i-1].state][y].Longitude;
            var size=total*5;
            if(size < 5000){size=5000}
            if(size > 30000){size=30000}
            var circ = L.circle([lat, lan], {radius: size}).addTo(mymap);
            if(name == "Unknown"){name=""}
            circ.bindPopup(name+"<br>Active : "+active+"<br>Total : "+total+"<br>Recovered : "+recover+"<br>Deaths : "+death);
          }
        }
      }
    }
  })

})
.catch((e) => {
  console.log(e);
})
