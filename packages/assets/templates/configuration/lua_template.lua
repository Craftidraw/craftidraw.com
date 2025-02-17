local function createItem(materialName, itemName, itemLore)
    local item = Instance.new("Tool")
    item.Name = itemName

    local handle = Instance.new("Part")
    handle.Name = "Handle"
    handle.Size = Vector3.new(1, 1, 4)
    handle.Material = Enum.Material[materialName]
    handle.Parent = item

    local description = Instance.new("StringValue")
    description.Name = "ItemLore"
    description.Value = table.concat(itemLore, "\n")
    description.Parent = item

    item.Parent = game.Players.LocalPlayer.Backpack

    return item
end

local material = "%item_entity%"
local name = "%item_display_name%"
local lore = {"%item_lore_1%", "%item_lore_2%"}

createItem(material, name, lore)