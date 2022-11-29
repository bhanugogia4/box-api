async function fetchDataAndRenderTable() {
  const params = new URLSearchParams(location.search);

  let serverURL = "http://localhost:8080/folder";
  if (params.get("folder_id"))
    serverURL += `?folder_id=${params.get("folder_id")}`;
  if (params.get("file_id")) serverURL += `?file_id=${params.get("file_id")}`;
  const dataFromTheServer = await fetch(serverURL).then((res) => res.json());
  const tableHTMLElement = document.createElement("table");
  tableHTMLElement.setAttribute("id", "myTable");
  const arr = Object.values(dataFromTheServer);

  tableHTMLElement.innerHTML = `
      <table>
        <tr>
          <th>Name</th>
          <th>Type</th>
        </tr>
        
    </table>`;

  arr.forEach((element) => {
    const newRow = tableHTMLElement.insertRow();

    var a = document.createElement("a");

    var link = document.createTextNode(element.name);

    a.appendChild(link);

    if (element.type === "folder")
      a.href = `${window.location.href}?folder_id=${element.id}`;
    else a.href = `http://localhost:8080/file?file_id=${element.id}`;

    let newCell = newRow.insertCell();
    let newText = document.createTextNode(element.name);
    newCell.appendChild(a);

    newCell = newRow.insertCell();
    newText = document.createTextNode(element.type);
    newCell.appendChild(newText);
  });

  document.body.appendChild(tableHTMLElement);
}

fetchDataAndRenderTable();
