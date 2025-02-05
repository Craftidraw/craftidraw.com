function createItem(material, itemName, itemLore) {
    const item = {
        material: material,
        name: itemName,
        lore: itemLore
    };

    console.log("Item Created:", item);

    return item;
}

const material = "%item_entity%";
const name = "%item_display_name%";
const lore = ["%item_lore_1%", "%item_lore_2%"];

createItem(material, name, lore);
