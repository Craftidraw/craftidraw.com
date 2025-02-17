using UnityEngine;

public class ItemCreator : MonoBehaviour
{
    public static GameObject CreateItem(
        string materialName = "%item_entity%",
        string itemName = "%item_display_name%",
        string[] itemLore = new string[] { %item_lore_all% }
    )
    {
        GameObject item = new GameObject(itemName);

        Material material = Resources.Load<Material>($"Materials/{materialName}");
        if (material != null)
        {
            Renderer renderer = item.AddComponent<MeshRenderer>();
            renderer.material = material;
        }

        ItemProperties properties = item.AddComponent<ItemProperties>();
        properties.ItemName = itemName;
        properties.ItemLore = itemLore;

        return item;
    }
}
