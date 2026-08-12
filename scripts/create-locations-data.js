const fs = require('fs');
const path = require('path');

const locationNames = [
    { name: 'Guindy', type: 'mixed', facilities: ['Corporate offices', 'Industrial units', 'Business parks', 'Commercial buildings'] },
    { name: 'Ambattur', type: 'industrial', facilities: ['Manufacturing units', 'Industrial estates', 'IT parks', 'Warehouses'] },
    { name: 'Thiruvanmiyur', type: 'commercial', facilities: ['IT companies', 'Corporate offices', 'Commercial complexes', 'Technology parks'] },
    { name: 'Perungudi', type: 'it_park', facilities: ['IT companies', 'Corporate offices', 'Technology parks', 'Commercial facilities'] },
    { name: 'Arumbakkam', type: 'commercial', facilities: ['Commercial buildings', 'Corporate offices', 'Retail spaces', 'Institutions'] },
    { name: 'Villivakkam', type: 'mixed', facilities: ['Commercial properties', 'Small manufacturing units', 'Warehouses', 'Corporate offices'] },
    { name: 'Kodungaiyur', type: 'industrial', facilities: ['Industrial sheds', 'Manufacturing facilities', 'Warehouses', 'Logistics hubs'] },
    { name: 'Sriperumbudur', type: 'heavy_industrial', facilities: ['Manufacturing facilities', 'Industrial plants', 'Warehouses', 'Automotive units'] },
    { name: 'Oragadam', type: 'heavy_industrial', facilities: ['Automotive facilities', 'Manufacturing units', 'Industrial warehouses', 'Logistics facilities'] },
    { name: 'Irungattukottai', type: 'heavy_industrial', facilities: ['Automotive parks', 'Manufacturing units', 'Industrial estates', 'Heavy engineering plants'] },
    { name: 'Vallam Vadagal', type: 'industrial', facilities: ['Aerospace parks', 'Manufacturing facilities', 'Industrial units', 'Logistics spaces'] },
    { name: 'Pillaipakkam', type: 'industrial', facilities: ['Industrial estates', 'Manufacturing units', 'Warehousing facilities', 'Commercial plants'] },
    { name: 'Siruseri', type: 'it_park', facilities: ['IT companies', 'Corporate offices', 'Technology parks', 'Business centers'] },
    { name: 'Nemili', type: 'industrial', facilities: ['Industrial warehouses', 'Manufacturing units', 'Logistics parks', 'Commercial sheds'] },
    { name: 'Thirumudivakkam', type: 'industrial', facilities: ['Industrial estates', 'Manufacturing facilities', 'Automotive ancillary units', 'Warehouses'] },
    { name: 'Gummidipoondi', type: 'heavy_industrial', facilities: ['Heavy manufacturing units', 'Industrial plants', 'Export zones', 'Warehousing complexes'] },
    { name: 'Thervoy Kandigai', type: 'industrial', facilities: ['Industrial parks', 'Manufacturing facilities', 'Automotive units', 'Logistics hubs'] },
    { name: 'Manallur', type: 'industrial', facilities: ['Industrial units', 'Manufacturing plants', 'Warehouses', 'Commercial facilities'] },
    { name: 'Mappedu', type: 'logistics', facilities: ['Logistics parks', 'Warehousing facilities', 'Dry ports', 'Industrial units'] },
    { name: 'Maraimalai Nagar', type: 'industrial', facilities: ['Automotive plants', 'Industrial estates', 'Manufacturing facilities', 'IT parks'] },
    { name: 'Alathur', type: 'industrial', facilities: ['Pharmaceutical parks', 'Industrial units', 'Manufacturing facilities', 'Warehouses'] },
    { name: 'Kakkalur', type: 'industrial', facilities: ['Industrial estates', 'Manufacturing units', 'Small scale industries', 'Warehouses'] },
    { name: 'Thirumazhisai', type: 'industrial', facilities: ['Industrial estates', 'Manufacturing plants', 'Warehousing facilities', 'Logistics hubs'] },
    { name: 'Vichoor', type: 'industrial', facilities: ['Industrial zones', 'Manufacturing units', 'Warehouses', 'Commercial sheds'] },
    { name: 'Thirumullaivoil', type: 'mixed', facilities: ['Industrial estates', 'Commercial buildings', 'Warehouses', 'Manufacturing units'] }
];

const locations = locationNames.map(loc => {
    return {
        id: loc.name.toLowerCase().replace(/ /g, '-'),
        name: loc.name,
        slug: 'chennai/' + loc.name.toLowerCase().replace(/ /g, '-') + '-commercial-cleaning',
        type: loc.type,
        facilities: loc.facilities
    };
});

const fileContent = 'module.exports = ' + JSON.stringify(locations, null, 4) + ';';
fs.writeFileSync(path.join(__dirname, 'locations.js'), fileContent);
console.log('locations.js generated successfully.');
