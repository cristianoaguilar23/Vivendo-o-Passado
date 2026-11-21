# Vivendo o Passado 1.4.4

## Novidade
- Filtros do catálogo gratuito por década: todas, anos 70, 80, 90 e 2000.
- O filtro por década funciona junto com a categoria e a busca por texto.
- Paginação, atualização e cache agora preservam também a década selecionada.
- Mantida a interface, o player e a estrutura Android existentes.

## Observações
- O filtro utiliza o campo `year` informado pelo Internet Archive. Obras sem ano catalogado podem não aparecer quando uma década específica está selecionada.
- A indicação de licença vem dos metadados publicados no Internet Archive e deve ser conferida na página original de cada obra.
- A reprodução depende da existência de um arquivo compatível, do servidor, da conexão e do WebView/Android do aparelho.
- A sintaxe JavaScript foi validada; busca remota e reprodução precisam ser testadas no APK instalado.
