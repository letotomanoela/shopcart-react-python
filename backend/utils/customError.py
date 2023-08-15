import re

# Fonction pour extraire le code d'erreur et le message de l'erreur d'origine
def extract_error_info(error_message):
    pattern = r"\((.*?)\)"
    match = re.search(pattern, error_message)
    if match:
        error_info = match.group(1).split(".")
        error_code = error_info[-1].strip()
        error_message = error_message.split(": ", 1)[-1]
        return error_code, error_message
    return None, None

