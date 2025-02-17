public static ItemStack createItem(ConfigurationSection section) {
    Material material = Material.valueOf("%item_entity%");
    ItemStack itemStack = new ItemStack(material, 1);
    ItemMeta itemMeta = itemStack.getItemMeta();
    if(itemMeta != null) {
        itemMeta.setDisplayName("%item_display_name%");
        itemMeta.setLore(%item_lore_all%);
        itemStack.setItemMeta(itemMeta);
    }
    return itemStack;
}