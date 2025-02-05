#include "YourGame.h"
#include "ItemCreator.h"
#include "Engine/StaticMesh.h"
#include "Materials/MaterialInterface.h"

AItem* UItemCreator::CreateItem(
    UWorld* World,
    FString MaterialName = TEXT("%item_entity%"),
    FString ItemName = TEXT("%item_display_name%"),
    TArray<FString> ItemLore = { TEXT(%item_lore_all%) }
)
{
    if (!World) return nullptr;

    AItem* Item = World->SpawnActor<AItem>(AItem::StaticClass());

    if (Item)
    {
        Item->SetName(ItemName);

        UMaterialInterface* Material = LoadObject<UMaterialInterface>(
            nullptr,
            *FString::Printf(
                TEXT("Material'/Game/Materials/%s.%s'"),
                *MaterialName,
                *MaterialName
            )
        );
        if (Material)
        {
            Item->SetMaterial(Material);
        }

        Item->SetLore(ItemLore);
    }

    return Item;
}
