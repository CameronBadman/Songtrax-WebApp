/**
 * The API key used to authenticate requests to the API.
 */
const APIKEY = '6MbYw9uAwm';

/**
 * The base URL of the API.
 */
const baseURL = 'https://comp2140.uqcloud.net/api/';

/**
 * Fetches a list of samples from the API.
 * @returns {Promise<Object[]>} A Promise that resolves to an array of sample objects.
 */
export async function getSamples() {
    const url = `${baseURL}sample/?api_key=${APIKEY}`;
    const response = await fetch(url);
    let json = await response.json();
    return json;
}

/**
 * Fetches a specific sample from the API by its ID.
 * @param {string} id - The ID of the sample to fetch.
 * @returns {Promise<Object>} A Promise that resolves to a sample object.
 */
export async function getSample(id) {
    const url = `${baseURL}sample/${id}/?api_key=${APIKEY}`;
    const response = await fetch(url);
    let json = await response.json();
    json.recording_data = JSON.parse(json.recording_data)
    return json;
}

/**
 * Creates a new sample and stores it in the API.
 * @param {string} type - The type of the sample (e.g., "piano").
 * @param {string} name - The name of the sample.
 * @param {Array} recording_data - An array of recording data.
 * @returns {Promise<Object>} A Promise that resolves to the created sample object.
 */
export async function createSample(type = "piano", name = "Best Pop Song", recording_data = []) {
    const url = `${baseURL}sample/?api_key=${APIKEY}`;
    const data = {
        type,
        name,
        'recording_data': JSON.stringify(recording_data),
        'api_key': APIKEY
    }
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();
    return json;
}

/**
 * Updates an existing sample in the API.
 * @param {string} id - The ID of the sample to update.
 * @param {string} type - The type of the sample (e.g., "piano").
 * @param {string} name - The updated name of the sample.
 * @param {Array} recording_data - The updated recording data.
 * @returns {Promise<Object>} A Promise that resolves to the updated sample object.
 * @throws {Error} If the update operation fails, an error is thrown.
 */
export async function updateSample(id, type, name, recording_data) {
    const url = `${baseURL}sample/${id}/?api_key=${APIKEY}`;
    const data = {
        type,
        name,
        'recording_data': JSON.stringify(recording_data),
        'api_key': APIKEY
    }
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update sample: ${errorData.message || 'Unknown error'}`);
    }

    const json = await response.json();
    return json;
}
