"""Holiday metadata is loaded in HA's executor by callers."""

def supported_subdivisions(country):
    import holidays
    supported = holidays.list_supported_countries(include_aliases=False)
    if country not in supported:
        raise ValueError('Unsupported holiday country')
    return list(supported[country])


def holiday_dates(country, subdivision, year):
    if not country:
        return set()
    import holidays
    regions = supported_subdivisions(country)
    if subdivision and subdivision not in regions:
        raise ValueError('Unsupported holiday subdivision')
    return set(holidays.country_holidays(country, subdiv=subdivision,
        years=range(year - 1, year + 2)).keys())


GERMAN_REGIONS = {
    'BW': 'Baden-Württemberg', 'BY': 'Bayern', 'BE': 'Berlin', 'BB': 'Brandenburg',
    'HB': 'Bremen', 'HH': 'Hamburg', 'HE': 'Hessen', 'MV': 'Mecklenburg-Vorpommern',
    'NI': 'Niedersachsen', 'NW': 'Nordrhein-Westfalen', 'RP': 'Rheinland-Pfalz',
    'SL': 'Saarland', 'SN': 'Sachsen', 'ST': 'Sachsen-Anhalt',
    'SH': 'Schleswig-Holstein', 'TH': 'Thüringen', 'Augsburg': 'Augsburg (Stadt)',
}
