"""
train_cnn_example.py
---------------------
REFERENCE SCRIPT — not run automatically.

`classifier.py` uses color/texture heuristics so the whole app works
end-to-end right now without needing a dataset. This script shows how to
replace it with a real trained deep-learning classifier once you have
labeled leaf images (e.g. the public PlantVillage dataset, or your own
field-collected + labeled photos).

Expected folder layout:
    dataset/
        train/
            healthy/*.jpg
            leaf_rust/*.jpg
            leaf_blight/*.jpg
            ...
        val/
            healthy/*.jpg
            leaf_rust/*.jpg
            ...

Usage:
    pip install tensorflow
    python train_cnn_example.py --data_dir ./dataset --epochs 15

After training, export the model, load it in main.py, and swap the
analyze() endpoint to call model.predict() instead of analyze_leaf_image().
"""

import argparse
import os


def build_model(num_classes: int, img_size=224):
    import tensorflow as tf
    from tensorflow.keras import layers, models

    base = tf.keras.applications.MobileNetV2(
        input_shape=(img_size, img_size, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False  # freeze for transfer learning; unfreeze later to fine-tune

    model = models.Sequential([
        layers.Input(shape=(img_size, img_size, 3)),
        layers.Rescaling(1.0 / 255),
        base,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(128, activation="relu"),
        layers.Dense(num_classes, activation="softmax"),
    ])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", required=True, help="Path to dataset/ with train/ and val/")
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--img_size", type=int, default=224)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--out", default="leaf_disease_model.keras")
    args = parser.parse_args()

    import tensorflow as tf

    train_ds = tf.keras.utils.image_dataset_from_directory(
        os.path.join(args.data_dir, "train"),
        image_size=(args.img_size, args.img_size),
        batch_size=args.batch_size,
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        os.path.join(args.data_dir, "val"),
        image_size=(args.img_size, args.img_size),
        batch_size=args.batch_size,
    )
    class_names = train_ds.class_names
    print("Classes:", class_names)

    model = build_model(num_classes=len(class_names), img_size=args.img_size)
    model.fit(train_ds, validation_data=val_ds, epochs=args.epochs)
    model.save(args.out)

    with open("class_names.txt", "w") as f:
        f.write("\n".join(class_names))

    print(f"Saved model to {args.out}. Update main.py to load it with tf.keras.models.load_model().")


if __name__ == "__main__":
    main()
