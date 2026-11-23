"""Offline regression checks for the public Flight and pricing adapters."""
import importlib.util
import json
import pathlib
import unittest

spec = importlib.util.spec_from_file_location('sync_zenmux', pathlib.Path(__file__).with_name('sync-zenmux.py'))
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class AdapterTests(unittest.TestCase):
    def test_resolves_length_delimited_flight_text_including_unicode(self):
        text = '中文计价条件'
        payload = 'a:T' + format(len(text.encode()), 'x') + ',' + text + 'b:{"models":[{"description":"$a"}]}\n'
        html = '<script>self.__next_f.push(' + json.dumps([1, payload]) + ')</script>'
        self.assertEqual(sync.flight(html)('models')[0]['description'], text)

    def test_preserves_tier_prices_and_conditions_without_unit_conversion(self):
        fees = [{'feeItemCode': 'prompt', 'feeItemName': '输入', 'feeRecords': [
            {'feeRate': '8.0000000000', 'components': [{'code': 'chargeUnit', 'value': 'millionTokens'}, {'code': 'promptKToken', 'name': '输入长度', 'value': {'max': 272}}]},
            {'feeRate': '16.0000000000', 'components': [{'code': 'chargeUnit', 'value': 'millionTokens'}, {'code': 'promptKToken', 'name': '输入长度', 'value': {'min': 272}}]},
        ]}]
        stages = sync.pricing(json.dumps(fees))
        self.assertEqual([stage['price'][0]['priceValue'] for stage in stages], ['8.0000000000', '16.0000000000'])
        self.assertEqual(stages[0]['price'][0]['unitCode'], 'M_TOKENS')
        self.assertEqual(stages[1]['price'][0]['constraints'][0]['value'], {'min': 272})
        self.assertTrue(all(stage['priceCurrency'] == 'USD' for stage in stages))


if __name__ == '__main__':
    unittest.main()
