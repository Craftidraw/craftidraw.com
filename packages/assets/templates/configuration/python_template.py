def create_item(material, item_name, item_lore):
    item = {
        'material': material,
        'name': item_name,
        'lore': item_lore
    }

    print("Item Created:", item)
    return item

material = "%item_entity%"
name = "%item_display_name%"
lore = ["%item_lore_1%", "%item_lore_2%"]

create_item(material, name, lore)
