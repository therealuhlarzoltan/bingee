# Generated by Django 4.1.6 on 2023-02-20 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0005_alter_episode_options_alter_season_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='series',
            name='image',
            field=models.URLField(null=True),
        ),
    ]
