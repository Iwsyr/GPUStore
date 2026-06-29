export function getProdById(data, id) {
    return data.find(item => item.id == id)
}

