# Verified Card Binary Import

The approved card images must exist in GitHub as individual PNG files for the digital game.

The connected chat GitHub tool can commit text files and Git tree objects, but it does not expose a local PNG upload parameter. Use this importer from a local clone or Codex workspace to move the verified package into stable repo paths.

Commands:

```bash
git checkout assets-verified-cards-20260702
python -m pip install pillow
python scripts/import_verified_card_assets.py /path/to/Weedopolis_Approved_HighChance_CommunityStash_Print_Package_v3.zip
git add assets/decks/verified_cards scripts/import_verified_card_assets.py docs/BINARY_ASSET_IMPORT.md
git commit -m "Add verified card image binaries"
git push origin assets-verified-cards-20260702
```

Expected image files:

```text
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_01.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_02.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_03.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_04.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_05.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_06.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_07.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_08.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_09.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_10.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_11.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_12.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_13.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_14.png
assets/decks/verified_cards/normalized_cards/high_chance/high_chance_15.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_01.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_02.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_03.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_04.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_05.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_06.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_07.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_08.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_09.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_10.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_11.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_12.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_13.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_14.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_15.png
assets/decks/verified_cards/normalized_cards/community_stash/community_stash_16.png
```

The importer fails if card count or pixel dimensions do not match the verified package.
