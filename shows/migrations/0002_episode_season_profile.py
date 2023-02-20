# Generated by Django 4.1.6 on 2023-02-19 21:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_customuser_gender'),
        ('shows', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Episode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Season',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('number_of_shows', models.PositiveSmallIntegerField(default=0)),
                ('number_of_episodes', models.PositiveSmallIntegerField(default=0)),
                ('date_of_last_watch', models.DateField(blank=True, null=True)),
                ('shows_added', models.ManyToManyField(to='shows.series')),
            ],
        ),
    ]
