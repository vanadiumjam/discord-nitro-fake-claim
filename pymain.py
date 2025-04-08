import discord
from discord.ext import commands
from discord.ui import View, Button
from discord import app_commands
from datetime import datetime
import asyncio
import random
import dotenv
import os

dotenv.load_dotenv()
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

class NitroButtonView(View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="Claim Nitro", style=discord.ButtonStyle.green, custom_id="claim_nitro_button")
    async def claim_nitro(self, interaction: discord.Interaction, button: discord.ui.Button):
        await asyncio.sleep(random.randint(2, 5))
        await interaction.response.send_message("This gift has already been claimed.", ephemeral=True)

# 메시지와 버튼 보내는 함수: 텍스트 커맨드와 슬래시 커맨드가 공유
async def send_nitro(interaction_or_ctx):
    if isinstance(interaction_or_ctx, commands.Context):
        author = interaction_or_ctx.author
    else:
        author = interaction_or_ctx.user

    embed = discord.Embed(
        title="You've been gifted a subscription!",
        description=f"{author.mention} has gifted you Nitro for **1 month**!",
        timestamp=datetime.now()
    )
    embed.set_image(url="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets.beartai.com%2Fuploads%2F2022%2F08%2FDiscordNitro.jpg&f=1&nofb=1&ipt=076550686750667128f3143a8304cc8b55b77d9d44a9106d1c0a65b704ed5ad4&ipo=images")
    embed.set_footer(text="Discord Nitro Generator Beta v1.0")

    view = NitroButtonView()

    if isinstance(interaction_or_ctx, commands.Context):
        await interaction_or_ctx.send(embed=embed, view=view)
    else:
        await interaction_or_ctx.response.send_message(embed=embed, view=view)

@bot.command(name="nitro")
async def nitro_command(ctx):
    await send_nitro(ctx)

@bot.tree.command(name="nitro", description="Give nitro")
async def nitro_slash(interaction: discord.Interaction):
    await send_nitro(interaction)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")
    try:
        await bot.tree.sync()
        print(f"Synced commands")
    except Exception as e:
        print(f"ERR: {e}")

bot.run(DISCORD_TOKEN)
