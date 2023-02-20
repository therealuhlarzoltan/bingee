# Generated by Django 4.1.6 on 2023-02-20 13:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0003_episode_episode_episode_episode_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='EpisodeComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='SeriesComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='WatchedEpisode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('episode', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shows.episode')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shows.profile')),
                ('series', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shows.series')),
            ],
        ),
    ]
