function dateFormat(format) {
    //parse the input date
    const date = new Date();

    //extract the parts of the date
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();    

    //replace the month
    format = format.replace("MM", month.toString().padStart(2,"0"));        

    //replace the year
    if (format.indexOf("yyyy") > -1) {
        format = format.replace("yyyy", year.toString());
    } else if (format.indexOf("yy") > -1) {
        format = format.replace("yy", year.toString().substr(2,2));
    }

    //replace the day
    format = format.replace("dd", day.toString().padStart(2,"0"));

    return format;
}

function randomise(){
    
    // Obtain the 4 digit binary group digit code and convert to a decimal value

    let xA = (parseInt(document.querySelector('[name="itmintnt"]').value)-1).toString()
    let xB = (parseInt(document.querySelector('[name="itmburdn"]').value)-1).toString()
    let xC = (parseInt(document.querySelector('[name="itmchemo"]').value)-1).toString()
    let xD = (parseInt(document.querySelector('[name="itmmetasta"]').value)-1).toString()

    document.querySelector('[name="ran_bin"]').value = xA+xB+xC+xD

    document.querySelector('[name="itmrndsdid"]').value = parseInt(xA+xB+xC+xD,2)

    // Call the API on the dataset to count the size of the group. Store the size in listNum

    fetch("https://redcap.imperial.ac.uk/api/", {
        method:"POST", 
        body:new URLSearchParams("content=report&token=849CF65CABA9C36020514F5771188F69&format=json&report_id=196&rawOrLabel=raw&rawOrLabelHeaders=raw&exportCheckbocLabel=false&returnFormat=json")})
        .then(response => response.text())
        .then(data => {
            JSON.parse(data).forEach(function(record){
                if(record.itmrndsdid == document.querySelector('[name="itmrndsdid"]').value){
                    console.log("Found a match, increasing listNum from "+groupSize)
                    groupSize = groupSize+1
                    console.log("to "+groupSize)
                }
        })
             // Save the position of the record in their group
             document.querySelector('[name="ran_seq"]').value = groupSize

              // Find the starting row number of the group in the randomisation table
              for (let i = 0; i < ranTab.length; i++) {
                  if(ranTab[i].ListID == document.querySelector('[name="itmrndsdid"]').value){
                    // Once found add the group size to the row number to find the position of the new subject to randomise and save their ID and outcome
                    // Minus 1 because the first record in the group should get the 0-indexed outcome, not the 0-index + 1
                    document.querySelector('[name="ran_rid"]').value = ranTab[i+groupSize-1].ID
                    document.querySelector('[name="itmrndubdrgdets"]').value = ranTab[i+groupSize-1].Treatment
                    break;
                  }
              }


              // Save the date
              document.querySelector('[name="itmrnddattim"]').value = dateFormat('dd-MM-yyyy')

              // Save the form
              dataEntrySubmit()

    })
}

// Create a empty variable will store the size of the current group size. We know that it is at least 1
let groupSize = 1

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("#ranMriBut").addEventListener('click',function(){
     
      setTimeout(randomise(),200);
      document.querySelector("#ranMriBut").removeEventListener()
       
    })
 })
